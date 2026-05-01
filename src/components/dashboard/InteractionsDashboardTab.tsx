'use client';

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import type { EventStatsPayload } from '@/lib/event-stats-types';
import { useGetEventStatsQuery, useGetEventsQuery } from '@/store/visitorsApi';
import { formatDistanceToNow } from 'date-fns';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

function InteractionStatCards({ stats }: { stats?: EventStatsPayload }) {
	if (!stats) {
		return (
			<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<Card key={i} aria-busy aria-live='polite'>
						<CardHeader className='pb-2'>
							<div className='h-4 w-32 animate-pulse rounded bg-muted/60' />
						</CardHeader>
						<CardContent>
							<div className='h-8 w-20 animate-pulse rounded bg-muted/60' />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	const topProject = stats.topProjects[0];
	const topSection = stats.topSections[0];

	return (
		<div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>
						Avg. time on page
					</CardTitle>
					<CardDescription className='text-xs'>page_duration avg</CardDescription>
				</CardHeader>
				<CardContent className='text-2xl font-semibold tabular-nums'>
					{stats.avgPageDuration.toLocaleString(undefined, {
						minimumFractionDigits: 0,
						maximumFractionDigits: 1,
					})}
					<span className='ml-1 text-sm font-normal text-muted-foreground'>s</span>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>
						Most clicked project
					</CardTitle>
					<CardDescription className='text-xs'>
						project_click events
					</CardDescription>
				</CardHeader>
				<CardContent className='text-lg font-semibold'>
					{topProject?.label ?? '—'}{' '}
					<span className='text-muted-foreground text-sm font-normal'>
						({topProject ? topProject.count : 0} clicks)
					</span>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>
						Most engaged section
					</CardTitle>
					<CardDescription className='text-xs'>
						section_view dwell time avg
					</CardDescription>
				</CardHeader>
				<CardContent className='text-lg font-semibold'>
					{topSection?.label?.replace(/^Section:\s*/i, '') ?? '—'}
					<span className='ml-2 text-muted-foreground text-sm font-normal'>
						avg {topSection ? `${topSection.avgDuration}s` : '—'}
					</span>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>
						Scrolled to 100%
					</CardTitle>
					<CardDescription className='text-xs'>
						of tracked scroll sessions
					</CardDescription>
				</CardHeader>
				<CardContent className='text-2xl font-semibold tabular-nums'>
					{stats.scrollDepthDistribution[100]}%
				</CardContent>
			</Card>
		</div>
	);
}

export function InteractionsDashboardTab() {
	const statsQuery = useGetEventStatsQuery();
	const eventsQuery = useGetEventsQuery(
		{ page: 1, limit: 50 },
		{ pollingInterval: 30_000 }
	);

	const stats = statsQuery.data;
	const counts = stats?.scrollDepthReachedCounts ?? {
		25: 0,
		50: 0,
		75: 0,
		100: 0,
	};
	const chartRows = ([25, 50, 75, 100] as const).map((pct) => ({
		name: `${pct}%`,
		visitors: counts[pct],
	}));

	const isRefreshing = statsQuery.isFetching || eventsQuery.isFetching;

	return (
		<div className='space-y-10'>
			<InteractionStatCards stats={stats} />

			<div className='grid gap-8 xl:grid-cols-2'>
				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-base'>Top projects</CardTitle>
						<CardDescription>By project_click count</CardDescription>
					</CardHeader>
					<CardContent className='p-0'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Project</TableHead>
									<TableHead className='text-right'>Clicks</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(stats?.topProjects.length ?? 0) === 0 ? (
									<TableRow>
										<TableCell
											colSpan={2}
											className='text-center text-muted-foreground'
										>
											No project clicks recorded yet.
										</TableCell>
									</TableRow>
								) : (
									stats!.topProjects.map((row) => (
										<TableRow key={row.label}>
											<TableCell className='font-medium'>
												{row.label}
											</TableCell>
											<TableCell className='text-right tabular-nums'>
												{row.count}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className='pb-2'>
						<CardTitle className='text-base'>Section engagement</CardTitle>
						<CardDescription>Average dwell time while in view</CardDescription>
					</CardHeader>
					<CardContent className='p-0'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Section</TableHead>
									<TableHead className='text-right'>Avg. seconds</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(stats?.topSections.length ?? 0) === 0 ? (
									<TableRow>
										<TableCell
											colSpan={2}
											className='text-center text-muted-foreground'
										>
											No section views logged yet (min 2s dwell).
										</TableCell>
									</TableRow>
								) : (
									stats!.topSections.map((row) => (
										<TableRow key={row.label}>
											<TableCell className='font-medium'>
												{row.label.replace(/^Section:\s*/i, '')}
											</TableCell>
											<TableCell className='text-right tabular-nums'>
												{row.avgDuration.toLocaleString(undefined, {
													maximumFractionDigits: 1,
												})}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>

			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-base'>Scroll depth reached</CardTitle>
					<CardDescription>
						Distinct visitors (device or session key) hitting each cumulative
						threshold — Y shows visitor counts.
					</CardDescription>
				</CardHeader>
				<CardContent className='h-72 w-full'>
					{chartRows.every((r) => r.visitors === 0) ? (
						<p className='flex h-full items-center justify-center text-sm text-muted-foreground'>
							No scroll-depth events collected yet.
						</p>
					) : (
						<ResponsiveContainer width='100%' height='100%' minHeight={260}>
							<BarChart data={chartRows} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
								<XAxis dataKey='name' tickLine={false} axisLine={false} />
								<YAxis
									width={56}
									allowDecimals={false}
									tickLine={false}
									axisLine={false}
								/>
								<Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
								<Bar dataKey='visitors' radius={[6, 6, 0, 0]} fill='hsl(var(--primary))' />
							</BarChart>
						</ResponsiveContainer>
					)}
				</CardContent>
			</Card>

			<div className='space-y-3'>
				<h3 className='text-lg font-semibold'>
					Recent events
					{isRefreshing ? (
						<span className='ml-2 text-xs font-normal text-muted-foreground'>
							Refreshing…
						</span>
					) : null}
				</h3>
				<Card className='overflow-hidden'>
					<div className='overflow-x-auto'>
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Time</TableHead>
									<TableHead>Type</TableHead>
									<TableHead>Label</TableHead>
									<TableHead>Path</TableHead>
									<TableHead className='text-right'>Value</TableHead>
									<TableHead>IP</TableHead>
									<TableHead>Country</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{eventsQuery.isLoading ? (
									<TableRow>
										<TableCell
											colSpan={7}
											className='text-center text-muted-foreground'
										>
											Loading events…
										</TableCell>
									</TableRow>
								) : (eventsQuery.data?.events.length ?? 0) === 0 ? (
									<TableRow>
										<TableCell
											colSpan={7}
											className='text-center text-muted-foreground'
										>
											No events found.
										</TableCell>
									</TableRow>
								) : (
									eventsQuery.data!.events.map((ev) => (
										<TableRow key={ev.id}>
											<TableCell className='whitespace-nowrap text-xs text-muted-foreground'>
												<span title={ev.timestamp}>
													{formatDistanceToNow(new Date(ev.timestamp), {
														addSuffix: true,
													})}
												</span>
											</TableCell>
											<TableCell className='font-mono text-xs'>{ev.type}</TableCell>
											<TableCell className='max-w-[200px] truncate' title={ev.label}>
												{ev.label || '—'}
											</TableCell>
											<TableCell className='max-w-[120px] truncate font-mono text-xs'>
												{ev.path}
											</TableCell>
											<TableCell className='text-right tabular-nums'>
												{ev.value ?? '—'}
											</TableCell>
											<TableCell className='font-mono text-xs'>
												{ev.visitor?.ip ?? '—'}
											</TableCell>
											<TableCell className='max-w-[100px] truncate text-xs'>
												{ev.visitor?.country ?? '—'}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>
				</Card>
			</div>
		</div>
	);
}
