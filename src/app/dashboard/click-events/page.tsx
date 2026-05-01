import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from '@/components/ui/card';

export default function ClickEventsPlaceholderPage() {
	return (
		<div className='space-y-8'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-semibold tracking-tight'>
					Click events
				</h1>
				<p className='max-w-prose text-sm text-muted-foreground'>
					Event-level analytics are not wired up yet. This section will list
					aggregated clicks and funnels once you implement the ingestion layer.
				</p>
			</div>
			<Card className='max-w-xl border-dashed'>
				<CardHeader>
					<CardTitle>Coming soon</CardTitle>
					<CardDescription>
						Use the Visitors area for traffic and geo while this module is built
						out.
					</CardDescription>
				</CardHeader>
			</Card>
		</div>
	);
}
