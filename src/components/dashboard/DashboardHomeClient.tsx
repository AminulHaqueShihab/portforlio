'use client';

import { StatCards } from '@/components/dashboard/StatCards';
import { Button } from '@/components/ui/button';
import { useGetVisitorStatsQuery } from '@/store/visitorsApi';
import { RefreshCw } from 'lucide-react';

export function DashboardHomeClient() {
	const statsQuery = useGetVisitorStatsQuery();

	const isRefreshing = statsQuery.isFetching;

	return (
		<div className='space-y-10'>
			<div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
				<div className='space-y-2'>
					<h1 className='text-3xl font-semibold tracking-tight'>
						Dashboard
					</h1>
					<p className='max-w-prose text-sm text-muted-foreground'>
						Summary metrics for tracked portfolio visits. Detailed rows and bulk
						actions live under{' '}
						<span className='font-medium text-foreground'>Visitors</span>. User
						clicks, sections, and scroll events are under{' '}
						<span className='font-medium text-foreground'>Interactions</span>.
					</p>
				</div>
				<Button
					type='button'
					variant='outline'
					className='shrink-0 gap-2 self-start'
					onClick={() => void statsQuery.refetch()}
					disabled={isRefreshing}>
					<RefreshCw
						className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
					/>
					Refresh stats
				</Button>
			</div>

			<StatCards stats={statsQuery.data} />
		</div>
	);
}
