import { escapeRegExp } from '@/lib/utils-escape-regexp';

const ALLOWED_SORT_KEYS = [
	'visitedAt',
	'lastSeen',
	'ip',
	'visitorDeviceId',
	'country',
	'city',
	'browser',
	'os',
	'deviceType',
	'referrer',
	'path',
	'isp',
	'visitCount',
] as const;

export type SortableVisitorKey = (typeof ALLOWED_SORT_KEYS)[number];

export type VisitorSerializable = {
	id: string;
	ip: string;
	visitorDeviceId: string;
	city: string;
	region: string;
	country: string;
	countryCode: string;
	latitude: number | null;
	longitude: number | null;
	isp: string;
	timezone: string;
	userAgent: string;
	browser: string;
	os: string;
	deviceType: string;
	referrer: string;
	language: string;
	path: string;
	visitedAt: string;
	lastSeen: string;
	visitCount: number;
};

export type VisitorsListResponse = {
	visitors: VisitorSerializable[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
	sortBy: SortableVisitorKey;
	sortOrder: 'asc' | 'desc';
	search: string;
};

export function parseVisitorQuery(request: Request): {
	page: number;
	limit: number;
	sortBy: SortableVisitorKey;
	sortOrder: 'asc' | 'desc';
	search?: string;
} {
	const url = new URL(request.url);
	const rawPage = url.searchParams.get('page');
	const rawLimit = url.searchParams.get('limit');
	let page = Number.parseInt(rawPage ?? '1', 10);
	let limit = Number.parseInt(rawLimit ?? '20', 10);

	if (!Number.isFinite(page) || page < 1) page = 1;
	if (!Number.isFinite(limit) || limit < 1) limit = 20;
	limit = Math.min(limit, 100);

	const sortCandidate = url.searchParams.get('sortBy') ?? 'lastSeen';
	const sortBy = ALLOWED_SORT_KEYS.includes(sortCandidate as SortableVisitorKey)
		? (sortCandidate as SortableVisitorKey)
		: 'lastSeen';

	const orderRaw =
		url.searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc';

	const rawSearch = url.searchParams.get('search') ?? '';
	const search =
		rawSearch.trim().length > 0 ? rawSearch.trim().slice(0, 128) : undefined;

	return { page, limit, sortBy, sortOrder: orderRaw, search };
}

export function searchFilter(term: string) {
	const re = new RegExp(escapeRegExp(term), 'i');
	return {
		$or: [{ ip: re }, { country: re }, { city: re }, { visitorDeviceId: re }],
	};
}

export function toSerializableVisitor(
	doc: Record<string, unknown> & { _id: { toString: () => string } }
): VisitorSerializable {
	const num = (v: unknown): number | null => {
		if (v === undefined || v === null) return null;
		const n = Number(v);
		return Number.isFinite(n) ? n : null;
	};

	return {
		id: doc._id.toString(),
		ip: String(doc.ip ?? ''),
		visitorDeviceId: String(doc.visitorDeviceId ?? ''),
		city: String(doc.city ?? ''),
		region: String(doc.region ?? ''),
		country: String(doc.country ?? ''),
		countryCode: String(doc.countryCode ?? ''),
		latitude: num(doc.latitude),
		longitude: num(doc.longitude),
		isp: String(doc.isp ?? ''),
		timezone: String(doc.timezone ?? ''),
		userAgent: String(doc.userAgent ?? ''),
		browser: String(doc.browser ?? ''),
		os: String(doc.os ?? ''),
		deviceType: String(doc.deviceType ?? 'desktop'),
		referrer: String(doc.referrer ?? ''),
		language: String(doc.language ?? ''),
		path: String(doc.path ?? ''),
		visitedAt: new Date(doc.visitedAt as string | Date).toISOString(),
		lastSeen: new Date(doc.lastSeen as string | Date).toISOString(),
		visitCount:
			doc.visitCount === undefined || doc.visitCount === null
				? 1
				: Math.max(1, Number(doc.visitCount)),
	};
}
