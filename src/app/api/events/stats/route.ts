import { requestHasAdminCookie } from '@/lib/admin-auth';
import type { EventStatsPayload } from '@/lib/event-stats-types';
import connectDB from '@/lib/mongodb';
import Event from '@/lib/models/Event';
import { NextResponse, type NextRequest } from 'next/server';

function dateFilter(searchParams: URLSearchParams): Record<string, unknown> | null {
	const from = searchParams.get('from')?.trim();
	const to = searchParams.get('to')?.trim();
	if (!from && !to) return null;

	const timestamp: Record<string, Date> = {};
	if (from) {
		const d = new Date(from);
		if (!Number.isNaN(d.getTime())) timestamp.$gte = d;
	}
	if (to) {
		const d = new Date(to);
		if (!Number.isNaN(d.getTime())) timestamp.$lte = d;
	}
	return Object.keys(timestamp).length ? { timestamp } : null;
}

export async function GET(request: NextRequest) {
	if (!(await requestHasAdminCookie(request))) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const dateMatch = dateFilter(new URL(request.url).searchParams);
	const matchStage =
		dateMatch && Object.keys(dateMatch).length > 0 ? { $match: dateMatch } : null;

	await connectDB();

	const basePipeline = matchStage ? [matchStage] : [];

	const [
		topProjectsRaw,
		topSectionsRaw,
		avgPageRaw,
		clicksByLabelRaw,
		eventsByTypeRaw,
		scrollGrouped,
	] = await Promise.all([
		Event.aggregate<{ _id: string | null; count: number }>([
			...basePipeline,
			{ $match: { type: 'project_click' } },
			{ $group: { _id: '$label', count: { $sum: 1 } } },
			{ $match: { _id: { $nin: [null, ''] } } },
			{ $sort: { count: -1 } },
			{ $limit: 10 },
		]).exec(),
		Event.aggregate<{ _id: string | null; avgDuration: number }>([
			...basePipeline,
			{ $match: { type: 'section_view' } },
			{ $group: { _id: '$label', avgDuration: { $avg: '$value' } } },
			{ $match: { _id: { $nin: [null, ''] } } },
			{ $sort: { avgDuration: -1 } },
			{ $limit: 20 },
		]).exec(),
		Event.aggregate<{ _id: null; avg: number | null }>([
			...basePipeline,
			{ $match: { type: 'page_duration' } },
			{ $group: { _id: null, avg: { $avg: '$value' } } },
		]).exec(),
		Event.aggregate<{ _id: string | null; count: number }>([
			...basePipeline,
			{ $match: { type: 'click' } },
			{ $group: { _id: '$label', count: { $sum: 1 } } },
			{ $match: { _id: { $nin: [null, ''] } } },
			{ $sort: { count: -1 } },
			{ $limit: 10 },
		]).exec(),
		Event.aggregate<{ _id: string; count: number }>([
			...basePipeline,
			{
				$group: {
					_id: '$type',
					count: { $sum: 1 },
				},
			},
			{ $sort: { count: -1 } },
		]).exec(),
		Event.aggregate<{ _id: string; maxDepth: number }>([
			...(matchStage ? [matchStage] : []),
			{
				$match: {
					type: 'scroll_depth',
					value: { $in: [25, 50, 75, 100] },
				},
			},
			{
				$addFields: {
					visitorKey: {
						$cond: [
							{
								$and: [
									{ $ne: ['$visitorDeviceId', null] },
									{ $ne: ['$visitorDeviceId', ''] },
								],
							},
							'$visitorDeviceId',
							'$sessionId',
						],
					},
				},
			},
			{
				$group: {
					_id: '$visitorKey',
					maxDepth: { $max: '$value' },
				},
			},
		]).exec(),
	]);

	const avgPageDuration = Math.round(
		Number(avgPageRaw[0]?.avg ?? 0) * 100
	) / 100;

	const scrollDepthDistribution: EventStatsPayload['scrollDepthDistribution'] =
		{ 25: 0, 50: 0, 75: 0, 100: 0 };
	const scrollDepthReachedCounts: EventStatsPayload['scrollDepthReachedCounts'] =
		{ 25: 0, 50: 0, 75: 0, 100: 0 };
	const totalScrollVisitors = scrollGrouped.length;
	if (totalScrollVisitors > 0) {
		for (const threshold of [25, 50, 75, 100] as const) {
			const count = scrollGrouped.filter((r) => r.maxDepth >= threshold).length;
			scrollDepthReachedCounts[threshold] = count;
			scrollDepthDistribution[threshold] = Math.round(
				(count / totalScrollVisitors) * 100
			);
		}
	}

	const payload: EventStatsPayload = {
		topProjects: topProjectsRaw.map((r) => ({
			label: String(r._id),
			count: r.count,
		})),
		topSections: topSectionsRaw.map((r) => ({
			label: String(r._id),
			avgDuration:
				Math.round(Number(r.avgDuration ?? 0) * 100) / 100,
		})),
		avgPageDuration,
		scrollDepthDistribution,
		scrollDepthReachedCounts,
		clicksByLabel: clicksByLabelRaw.map((r) => ({
			label: String(r._id),
			count: r.count,
		})),
		eventsByType: eventsByTypeRaw.map((r) => ({
			type: String(r._id),
			count: r.count,
		})),
	};

	return NextResponse.json(payload);
}
