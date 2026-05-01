import connectDB from '@/lib/mongodb';
import Visitor from '@/lib/models/Visitor';
import { getClientIp } from '@/lib/get-client-ip';
import { lookupIpGeo } from '@/lib/ip-lookup';
import { parseUserAgent } from '@/lib/parse-user-agent';
import { type NextRequest, NextResponse } from 'next/server';

const DEDUP_MS = 30 * 60 * 1000;

function isMongoBadAuth(error: unknown): boolean {
	const msg = error instanceof Error ? error.message : '';
	const obj = error && typeof error === 'object' ? error : null;
	const code = obj && 'code' in obj ? (obj as { code: unknown }).code : undefined;
	const name =
		obj && 'name' in obj && typeof (obj as { name: unknown }).name === 'string'
			? (obj as { name: string }).name
			: '';
	if (code === 8000 || (name === 'MongoServerError' && /bad auth/i.test(msg))) {
		return true;
	}
	return /authentication failed|bad auth/i.test(msg);
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json().catch(() => ({}))) as {
			path?: string;
		};
		const path =
			typeof body.path === 'string' ? body.path.slice(0, 2048) : '/';

		const ip = getClientIp(request);
		const geo = await lookupIpGeo(ip);
		const uaHeader = request.headers.get('user-agent');
		const { browser, os, deviceType } = parseUserAgent(uaHeader);
		const referrer = request.headers.get('referer') ?? '';
		const language = request.headers.get('accept-language') ?? '';

		await connectDB();

		const now = new Date();
		const cutoff = new Date(Date.now() - DEDUP_MS);

		const existingDoc = await Visitor.findOne({
			ip,
			lastSeen: { $gte: cutoff },
		}).sort({ lastSeen: -1 });

		if (existingDoc) {
			await Visitor.updateOne(
				{ _id: existingDoc._id },
				{
					$set: { lastSeen: now, path },
					$inc: { visitCount: 1 },
				}
			);
			return NextResponse.json({ ok: true, deduped: true });
		}

		await Visitor.create({
			ip: geo.ip || ip,
			city: geo.city,
			region: geo.region,
			country: geo.country,
			countryCode: geo.countryCode,
			latitude: geo.latitude ?? undefined,
			longitude: geo.longitude ?? undefined,
			isp: geo.isp,
			timezone: geo.timezone,
			userAgent: uaHeader ?? '',
			browser,
			os,
			deviceType,
			referrer,
			language,
			path,
			visitedAt: now,
			lastSeen: now,
			visitCount: 1,
		});

		return NextResponse.json({ ok: true });
	} catch (e) {
		if (isMongoBadAuth(e)) {
			console.error(
				'[visitor info] MongoDB authentication failed. Check MONGODB_URI: Atlas Database Access username/password must match exactly; URL-encode special characters in the password (@ : / ? # [ ] …). If needed, try MONGODB_AUTH_MECHANISM=SCRAM-SHA-256 (or SCRAM-SHA-1 for legacy DB users).'
			);
			return NextResponse.json({ ok: false }, { status: 503 });
		}
		console.error('[visitor info]', e);
		return NextResponse.json({ ok: false }, { status: 500 });
	}
}
