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

function numOrNull(v: unknown): number | null {
	if (typeof v === 'number' && Number.isFinite(v)) return v;
	if (typeof v === 'string') {
		const n = parseFloat(v);
		return Number.isFinite(n) ? n : null;
	}
	return null;
}

async function fetchWithTimeout(url: string, ms: number): Promise<Response> {
	const controller = new AbortController();
	const t = setTimeout(() => controller.abort(), ms);
	try {
		return await fetch(url, {
			signal: controller.signal,
			headers: { Accept: 'application/json' },
			cache: 'no-store',
		});
	} finally {
		clearTimeout(t);
	}
}

/** One provider must not throw away the rest of the chain (abort, bad JSON, etc.). */
async function tryProvider(
	fn: () => Promise<IpLookupResult | null>
): Promise<IpLookupResult | null> {
	try {
		return await fn();
	} catch {
		return null;
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
		latitude: numOrNull(data.latitude),
		longitude: numOrNull(data.longitude),
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

async function tryGeoJs(ip: string): Promise<IpLookupResult | null> {
	const res = await fetchWithTimeout(
		`https://get.geojs.io/v1/ip/geo/${encodeURIComponent(ip)}.json`,
		8000
	);
	if (!res.ok) return null;

	const raw = (await res.json()) as Record<string, unknown>;
	const country = typeof raw.country === 'string' ? raw.country : '';
	const city = typeof raw.city === 'string' ? raw.city : '';
	if (!country.trim() && !city.trim()) return null;

	const isp =
		(typeof raw.organization_name === 'string' && raw.organization_name) ||
		(typeof raw.organization === 'string' ? raw.organization : '');

	return {
		ip: String(raw.ip ?? ip),
		city,
		region: typeof raw.region === 'string' ? raw.region : '',
		country,
		countryCode: String(raw.country_code ?? '')
			.toUpperCase(),
		latitude: numOrNull(raw.latitude),
		longitude: numOrNull(raw.longitude),
		isp,
		timezone: typeof raw.timezone === 'string' ? raw.timezone : '',
	};
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

	return {
		ip: String(raw.ip ?? ip),
		city: typeof raw.city === 'string' ? raw.city : '',
		region: typeof raw.region === 'string' ? raw.region : '',
		country: typeof raw.country === 'string' ? raw.country : '',
		countryCode: String(raw.country_code ?? '')
			.toUpperCase(),
		latitude: numOrNull(raw.latitude),
		longitude: numOrNull(raw.longitude),
		isp,
		timezone,
	};
}

function hasGeoSignal(r: IpLookupResult): boolean {
	return (
		Boolean(r.country?.trim()) ||
		Boolean(r.countryCode?.trim()) ||
		Boolean(r.city?.trim()) ||
		r.latitude != null ||
		r.longitude != null
	);
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

	const ipapiKey = process.env.IPAPI_CO_API_KEY?.trim();
	const tries: Array<() => Promise<IpLookupResult | null>> = [];
	if (ipapiKey) tries.push(() => tryIpapi(ip, ipapiKey));
	tries.push(() => tryGeoJs(ip));
	tries.push(() => tryIpWhoIs(ip));
	if (!ipapiKey) tries.push(() => tryIpapi(ip));

	for (const provider of tries) {
		const r = await tryProvider(provider);
		if (r && hasGeoSignal(r)) return r;
	}

	return base;
}
