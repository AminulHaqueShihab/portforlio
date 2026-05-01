'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { countryCodeToFlagEmoji } from '@/lib/country-flag-emoji';

import type { VisitorStatsPayload } from '@/lib/visitor-stats-types';

type StatCardsProps = {
	stats?: VisitorStatsPayload;
};

export function StatCards({ stats }: StatCardsProps) {
	const muted = 'text-muted-foreground text-xs';

	if (!stats) {
		return (
			<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
				{Array.from({ length: 5 }).map((_, i) => (
					<Card key={i} aria-busy aria-live='polite'>
						<CardHeader className='pb-2'>
							<CardTitle className='text-sm font-medium'>Loading…</CardTitle>
						</CardHeader>
						<CardContent>
							<div className='h-10 w-24 animate-pulse rounded bg-muted/60' />
						</CardContent>
					</Card>
				))}
			</div>
		);
	}

	return (
		<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-5'>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Total visitors</CardTitle>
				</CardHeader>
				<CardContent className='text-2xl font-semibold tabular-nums'>
					{stats.totalVisitorRecords.toLocaleString()}
					<div className={muted}>
						Visits recorded: {stats.totalVisits.toLocaleString()}
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Unique visitors</CardTitle>
				</CardHeader>
				<CardContent className='text-2xl font-semibold tabular-nums'>
					{stats.uniqueVisitors.toLocaleString()}
					<div className={muted}>
						By anonymous device ID when available; else IP (legacy).
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>Top country</CardTitle>
				</CardHeader>
				<CardContent className='text-xl font-semibold'>
					{stats.topCountry ? (
						<div className='flex flex-wrap items-center gap-2'>
							<span className='text-2xl' aria-hidden>
								{countryCodeToFlagEmoji(stats.topCountry.code)}
							</span>
							<span className='truncate'>
								{stats.topCountry.name || stats.topCountry.code}
							</span>
							<span className={`${muted} whitespace-nowrap`}>
								{stats.topCountry.visits} visits
							</span>
						</div>
					) : (
						<span className={muted}>—</span>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>
						Most common device type
					</CardTitle>
				</CardHeader>
				<CardContent className='text-2xl font-semibold capitalize'>
					{stats.topDeviceType ? (
						<span className='inline-flex flex-wrap items-center gap-2'>
							<span>{stats.topDeviceType.type}</span>
							<span className={muted}>
								{stats.topDeviceType.visits.toLocaleString()} visits
							</span>
						</span>
					) : (
						<span className={muted}>—</span>
					)}
				</CardContent>
			</Card>
			<Card>
				<CardHeader className='pb-2'>
					<CardTitle className='text-sm font-medium'>
						Most common browser
					</CardTitle>
				</CardHeader>
				<CardContent className='text-xl font-semibold'>
					{stats.topBrowser ? (
						<span className='inline-flex flex-col gap-1'>
							<span className='truncate' title={stats.topBrowser.browser}>
								{stats.topBrowser.browser}
							</span>
							<span className={muted}>
								{stats.topBrowser.visits.toLocaleString()} visits
							</span>
						</span>
					) : (
						<span className={muted}>—</span>
					)}
				</CardContent>
			</Card>
		</div>
	);
}
