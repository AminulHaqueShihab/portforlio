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

	const controller = new AbortController();
	const t = setTimeout(() => controller.abort(), 8000);
	try {
		const res = await fetch(`https://ipapi.co/${encodeURIComponent(ip)}/json/`, {
			signal: controller.signal,
			headers: { Accept: 'application/json' },
			next: { revalidate: 0 },
		});
		if (!res.ok) return base;
		const data = (await res.json()) as Record<string, unknown>;
		if (data.error) return base;

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
	} catch {
		return base;
	} finally {
		clearTimeout(t);
	}
}
