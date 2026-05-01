'use client';

import { InteractionsDashboardTab } from '@/components/dashboard/InteractionsDashboardTab';

export default function InteractionsPage() {
	return (
		<div className='space-y-8'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-semibold tracking-tight'>Interactions</h1>
				<p className='max-w-prose text-sm text-muted-foreground'>
					Event stream: clicks, project views, section dwell times, scroll
					thresholds, and page duration.
				</p>
			</div>
			<InteractionsDashboardTab />
		</div>
	);
}
