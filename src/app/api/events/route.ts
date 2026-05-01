import { requestHasAdminCookie } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import Visitor from '@/lib/models/Visitor';
import type { EventsListResponse, EventListItem } from '@/lib/events-list-types';
import { NextResponse, type NextRequest } from 'next/server';

const EVENT_TYPES = new Set([
	'click',
	'project_click',
	'section_view',
	'page_duration',
	'scroll_depth',
]);

type IncomingEvent = {
	visitorDeviceId?: string;
	sessionId: string;
	type: string;
	label?: string;
	path: string;
	value?: number;
	metadata?: Record<string, unknown>;
	timestamp: string;
};

async function parseJsonBody(request: NextRequest): Promise<unknown> {
	const raw = await request.text();
	if (!raw) return {};
	try {
		return JSON.parse(raw) as unknown;
	} catch {
		return null;
	}
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function POST(request: NextRequest) {
	const parsed = await parseJsonBody(request);
	if (parsed === null) {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	if (!isPlainObject(parsed) || !Array.isArray(parsed.events)) {
		return NextResponse.json({ error: 'Expected { events: [...] }' }, { status: 400 });
	}

	const incoming = parsed.events as unknown[];
	if (incoming.length === 0) {
		return NextResponse.json({ inserted: 0 });
	}

	const normalized: IncomingEvent[] = [];
	for (const row of incoming) {
		if (!isPlainObject(row)) continue;
		const sessionId = typeof row.sessionId === 'string' ? row.sessionId.trim() : '';
		const type = typeof row.type === 'string' ? row.type.trim() : '';
		const path = typeof row.path === 'string' ? row.path : '';
		if (!sessionId || !type || !path || !EVENT_TYPES.has(type)) continue;
		const ts =
			typeof row.timestamp === 'string' ? new Date(row.timestamp) : new Date();
		if (Number.isNaN(ts.getTime())) continue;

		const visitorDeviceId =
			typeof row.visitorDeviceId === 'string'
				? row.visitorDeviceId.trim().slice(0, 36)
				: undefined;

		normalized.push({
			sessionId: sessionId.slice(0, 128),
			type,
			path: path.slice(0, 2048),
			label:
				typeof row.label === 'string' ? row.label.slice(0, 512) : undefined,
			value: typeof row.value === 'number' && Number.isFinite(row.value) ? row.value : undefined,
			metadata: isPlainObject(row.metadata) ? row.metadata : undefined,
			timestamp: ts.toISOString(),
			...(visitorDeviceId ? { visitorDeviceId } : {}),
		});
	}

	if (normalized.length === 0) {
		return NextResponse.json({ error: 'No valid events' }, { status: 400 });
	}

	await connectDB();

	const deviceIds = Array.from(
		new Set(
			normalized
				.map((e) => e.visitorDeviceId)
				.filter((id): id is string => Boolean(id))
		)
	);

	const visitorMap = new Map<string, import('mongoose').Types.ObjectId>();
	if (deviceIds.length > 0) {
		const visitors = await Visitor.find({
			visitorDeviceId: { $in: deviceIds },
		})
			.select('_id visitorDeviceId')
			.lean()
			.exec();
		for (const v of visitors) {
			if (v.visitorDeviceId) {
				visitorMap.set(v.visitorDeviceId, v._id);
			}
		}
	}

	const docs = normalized.map((e) => ({
		sessionId: e.sessionId,
		type: e.type as IncomingEvent['type'],
		path: e.path,
		...(e.label !== undefined ? { label: e.label } : {}),
		...(e.value !== undefined ? { value: e.value } : {}),
		...(e.metadata !== undefined ? { metadata: e.metadata } : {}),
		timestamp: new Date(e.timestamp),
		...(e.visitorDeviceId ? { visitorDeviceId: e.visitorDeviceId } : {}),
		visitorId: e.visitorDeviceId
			? visitorMap.get(e.visitorDeviceId)
			: undefined,
	}));

	const inserted = await Event.insertMany(docs, { ordered: false });

	return NextResponse.json({ inserted: inserted.length });
}

function parseIntParam(
	value: string | null,
	fallback: number,
	min: number,
	max: number
): number {
	if (value === null || value === '') return fallback;
	const n = Number.parseInt(value, 10);
	if (!Number.isFinite(n)) return fallback;
	return Math.min(max, Math.max(min, n));
}

export async function GET(request: NextRequest) {
	if (!(await requestHasAdminCookie(request))) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { searchParams } = new URL(request.url);
	const page = parseIntParam(searchParams.get('page'), 1, 1, 10_000);
	const limit = parseIntParam(searchParams.get('limit'), 50, 1, 100);
	const type = searchParams.get('type')?.trim();
	const pathFilter = searchParams.get('path')?.trim();
	const from = searchParams.get('from')?.trim();
	const to = searchParams.get('to')?.trim();

	const filter: Record<string, unknown> = {};
	if (type && EVENT_TYPES.has(type)) {
		filter.type = type;
	}
	if (pathFilter) {
		filter.path = pathFilter;
	}
	if (from || to) {
		filter.timestamp = {} as Record<string, Date>;
		if (from) {
			const d = new Date(from);
			if (!Number.isNaN(d.getTime())) {
				(filter.timestamp as Record<string, Date>).$gte = d;
			}
		}
		if (to) {
			const d = new Date(to);
			if (!Number.isNaN(d.getTime())) {
				(filter.timestamp as Record<string, Date>).$lte = d;
			}
		}
	}

	await connectDB();

	const skip = (page - 1) * limit;

	const [rows, total] = await Promise.all([
		Event.find(filter)
			.sort({ timestamp: -1 })
			.skip(skip)
			.limit(limit)
			.populate({
				path: 'visitorId',
				select: 'ip country browser deviceType',
			})
			.lean()
			.exec(),
		Event.countDocuments(filter),
	]);

	const events: EventListItem[] = rows.map((row) => {
		const v = row.visitorId as unknown;
		let visitor: EventListItem['visitor'] = null;
		if (v && typeof v === 'object' && v !== null && '_id' in v) {
			const o = v as {
				ip?: string;
				country?: string;
				browser?: string;
				deviceType?: string;
			};
			visitor = {
				ip: o.ip ?? '',
				country: o.country ?? '',
				browser: o.browser ?? '',
				deviceType: o.deviceType ?? '',
			};
		}
		return {
			id: String(row._id),
			type: row.type,
			label: row.label ?? '',
			path: row.path,
			value:
				row.value !== undefined && row.value !== null
					? Number(row.value)
					: null,
			timestamp:
				row.timestamp instanceof Date
					? row.timestamp.toISOString()
					: new Date(row.timestamp as string).toISOString(),
			sessionId: row.sessionId ?? '',
			visitorDeviceId: row.visitorDeviceId ?? '',
			visitor,
		};
	});

	const totalPages = Math.max(1, Math.ceil(total / limit));

	const body: EventsListResponse = {
		events,
		total,
		page,
		limit,
		totalPages,
	};

	return NextResponse.json(body);
}
