'use client';

import { VisitorsDashboardTab } from '@/components/dashboard/VisitorsDashboardTab';

export default function VisitorsPage() {
	return (
		<div className='space-y-8'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-semibold tracking-tight'>Visitors</h1>
				<p className='max-w-prose text-sm text-muted-foreground'>
					Browse, inspect, or delete visitor records persisted in MongoDB.
				</p>
			</div>
			<VisitorsDashboardTab />
		</div>
	);
}
