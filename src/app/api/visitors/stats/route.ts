import { requestHasAdminCookie } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import Visitor from '@/lib/models/Visitor';
import type { VisitorStatsPayload } from '@/lib/visitor-stats-types';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	if (!(await requestHasAdminCookie(request))) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	await connectDB();

	const [totalVisitorRecords, aggregate] = await Promise.all([
		Visitor.countDocuments(),
		Visitor.aggregate<{ totalVisits: number | null | undefined }>([
			{ $group: { _id: null, totalVisits: { $sum: '$visitCount' } } },
		]).then((r) => r[0]),
	]);

	const totalVisits = Math.max(
		0,
		Math.floor(Number(aggregate?.totalVisits ?? 0))
	);

	const uniqueIps = await Visitor.distinct<string>('ip');
	const uniqueIpCountNum = Array.isArray(uniqueIps)
		? uniqueIps.filter(Boolean).length
		: 0;

	type CountryAgg = {
		_id: { code: string; name: string };
		visits: number;
	};

	const topCountries = await Visitor.aggregate<CountryAgg>([
		{
			$group: {
				_id: { code: '$countryCode', name: '$country' },
				visits: { $sum: '$visitCount' },
			},
		},
		{ $sort: { visits: -1 } },
		{ $limit: 1 },
	]);

	const topCountryRow = topCountries[0];
	let topCountry: VisitorStatsPayload['topCountry'] = null;
	const code = topCountryRow?._id?.code?.toString().trim();
	if (topCountryRow && code) {
		topCountry = {
			code,
			name: String(topCountryRow._id?.name ?? ''),
			visits: topCountryRow.visits,
		};
	}

	const topDevices = await Visitor.aggregate<{ _id: string; visits: number }>(
		[
			{ $match: { deviceType: { $in: ['mobile', 'tablet', 'desktop'] } } },
			{ $group: { _id: '$deviceType', visits: { $sum: '$visitCount' } } },
			{ $sort: { visits: -1 } },
			{ $limit: 1 },
		]
	);

	const td = topDevices[0];

	const topBrowsers = await Visitor.aggregate<{ _id: string; visits: number }>(
		[
			{
				$group: {
					_id: { $ifNull: ['$browser', 'Unknown'] },
					visits: { $sum: '$visitCount' },
				},
			},
			{ $sort: { visits: -1 } },
			{ $limit: 1 },
		]
	);

	const tb = topBrowsers[0];

	const payload: VisitorStatsPayload = {
		totalVisitorRecords,
		totalVisits,
		uniqueIpCount: uniqueIpCountNum,
		topCountry,
		topDeviceType: td ? { type: td._id, visits: td.visits } : null,
		topBrowser: tb ? { browser: tb._id, visits: tb.visits } : null,
	};

	return NextResponse.json(payload);
}
