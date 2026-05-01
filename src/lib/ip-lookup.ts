import { isLoopbackIp } from '@/lib/is-loopback-ip';

export type IpLookupResult = {
	ip: string;
	city: string;
	region: string;
	country: string;
	countryCode: string;
	latitude: number | null;
	longitude: number | null;
	isp: string;
	timezone: string;
};

const EMPTY: Omit<IpLookupResult, 'ip'> = {
	city: '',
	region: '',
	country: '',
	countryCode: '',
	latitude: null,
	longitude: null,
	isp: '',
	timezone: '',
};

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
	const controller = new AbortController();
	const t = setTimeout(() => controller.abort(), ms);
	try {
		return await fetch(url, {
			signal: controller.signal,
			headers: { Accept: 'application/json' },
			next: { revalidate: 0 },
		});
	} finally {
		clearTimeout(t);
	}
}

function mapIpapiPayload(
	ip: string,
	data: Record<string, unknown>
): IpLookupResult {
	return {
		ip: String(data.ip ?? ip),
		city: String(data.city ?? ''),
		region: String(data.region ?? data.region_code ?? ''),
		country: String(data.country_name ?? data.country ?? ''),
		countryCode: String(data.country_code ?? '').toUpperCase(),
		latitude:
			typeof data.latitude === 'number' ? data.latitude : null,
		longitude:
			typeof data.longitude === 'number' ? data.longitude : null,
		isp: String(data.org ?? data.org_name ?? data.asn ?? ''),
		timezone: String(data.timezone ?? ''),
	};
}

async function tryIpapi(ip: string, apiKey?: string): Promise<IpLookupResult | null> {
	let url = `https://ipapi.co/${encodeURIComponent(ip)}/json/`;
	if (apiKey) url += `?key=${encodeURIComponent(apiKey)}`;

	const res = await fetchWithTimeout(url, 8000);
	if (!res.ok) return null;
	const data = (await res.json()) as Record<string, unknown>;
	if (data.error) return null;
	return mapIpapiPayload(ip, data);
}

async function tryIpWhoIs(ip: string): Promise<IpLookupResult | null> {
	const res = await fetchWithTimeout(
		`https://ipwho.is/${encodeURIComponent(ip)}`,
		8000
	);
	if (!res.ok) return null;

	const raw = (await res.json()) as Record<string, unknown>;
	if (raw.success !== true) return null;

	const conn = raw.connection as Record<string, unknown> | undefined;
	const tz = raw.timezone as Record<string, unknown> | undefined;
	const isp =
		(typeof conn?.isp === 'string' && conn.isp) ||
		(typeof conn?.org === 'string' ? conn.org : '');
	const timezone = typeof tz?.id === 'string' ? tz.id : '';

	let lat: number | null =
		typeof raw.latitude === 'number' ? raw.latitude : null;
	let lon: number | null =
		typeof raw.longitude === 'number' ? raw.longitude : null;
	return {
		ip: String(raw.ip ?? ip),
		city: typeof raw.city === 'string' ? raw.city : '',
		region: typeof raw.region === 'string' ? raw.region : '',
		country: typeof raw.country === 'string' ? raw.country : '',
		countryCode: String(raw.country_code ?? '')
			.toUpperCase(),
		latitude: lat,
		longitude: lon,
		isp,
		timezone,
	};
}

export async function lookupIpGeo(ip: string): Promise<IpLookupResult> {
	const base = { ip, ...EMPTY };

	if (isLoopbackIp(ip)) {
		return {
			ip,
			city: '—',
			region: '',
			country: 'Local (loopback)',
			countryCode: '',
			latitude: null,
			longitude: null,
			isp: '—',
			timezone: '',
		};
	}

	try {
		const ipapiKey = process.env.IPAPI_CO_API_KEY?.trim();
		if (ipapiKey) {
			const fromIpapi = await tryIpapi(ip, ipapiKey);
			if (fromIpapi) return fromIpapi;
		}

		const fromIpWho = await tryIpWhoIs(ip);
		if (fromIpWho) return fromIpWho;

		if (!ipapiKey) {
			const fromIpapiFree = await tryIpapi(ip);
			if (fromIpapiFree) return fromIpapiFree;
		}
	} catch {
		/* return base below */
	}

	return base;
}
