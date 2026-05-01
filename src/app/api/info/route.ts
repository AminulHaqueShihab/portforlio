import connectDB from '@/lib/mongodb';
import Visitor from '@/lib/models/Visitor';
import { getClientIp } from '@/lib/get-client-ip';
import { lookupIpGeo } from '@/lib/ip-lookup';
import { parseUserAgent } from '@/lib/parse-user-agent';
import { sanitizeVisitorDeviceId } from '@/lib/visitor-device-id';
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

function legacyMissingDeviceClause() {
	return {
		$or: [
			{ visitorDeviceId: { $exists: false } },
			{ visitorDeviceId: null },
			{ visitorDeviceId: '' },
		],
	};
}

export async function POST(request: NextRequest) {
	try {
		const body = (await request.json().catch(() => ({}))) as {
			path?: string;
			visitorDeviceId?: string;
		};
		const path =
			typeof body.path === 'string' ? body.path.slice(0, 2048) : '/';

		const ip = getClientIp(request);
		const geo = await lookupIpGeo(ip);
		const canonicalIp = geo.ip || ip;
		const uaHeader = request.headers.get('user-agent');
		const { browser, os, deviceType } = parseUserAgent(uaHeader);
		const referrer = request.headers.get('referer') ?? '';
		const language = request.headers.get('accept-language') ?? '';

		const normalizedDeviceId = sanitizeVisitorDeviceId(body.visitorDeviceId);

		await connectDB();

		const now = new Date();
		const cutoff = new Date(Date.now() - DEDUP_MS);

		if (normalizedDeviceId) {
			const byDevice = await Visitor.findOne({
				visitorDeviceId: normalizedDeviceId,
				lastSeen: { $gte: cutoff },
			})
				.sort({ lastSeen: -1 })
				.exec();

			if (byDevice) {
				await Visitor.updateOne(
					{ _id: byDevice._id },
					{
						$set: { lastSeen: now, path },
						$inc: { visitCount: 1 },
					}
				);
				return NextResponse.json({ ok: true, deduped: true });
			}

			const bridge = await Visitor.findOne({
				ip: canonicalIp,
				lastSeen: { $gte: cutoff },
				...legacyMissingDeviceClause(),
			})
				.sort({ lastSeen: -1 })
				.exec();

			if (bridge) {
				await Visitor.updateOne(
					{ _id: bridge._id },
					{
						$set: {
							visitorDeviceId: normalizedDeviceId,
							lastSeen: now,
							path,
						},
						$inc: { visitCount: 1 },
					}
				);
				return NextResponse.json({ ok: true, deduped: true });
			}
		} else {
			const byIp = await Visitor.findOne({
				ip: canonicalIp,
				lastSeen: { $gte: cutoff },
			})
				.sort({ lastSeen: -1 })
				.exec();

			if (byIp) {
				await Visitor.updateOne(
					{ _id: byIp._id },
					{
						$set: { lastSeen: now, path },
						$inc: { visitCount: 1 },
					}
				);
				return NextResponse.json({ ok: true, deduped: true });
			}
		}

		await Visitor.create({
			ip: canonicalIp,
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
			...(normalizedDeviceId ? { visitorDeviceId: normalizedDeviceId } : {}),
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
