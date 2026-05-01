'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { countryCodeToFlagEmoji } from '@/lib/country-flag-emoji';
import type { VisitorSerializable } from '@/lib/visitors-query';
import { format, parseISO } from 'date-fns';

function fmtDt(iso: string): string {
	try {
		return format(parseISO(iso), 'MMM d, yyyy · h:mm aa');
	} catch {
		return iso;
	}
}

const ROWS: { key: keyof VisitorSerializable; label: string }[] = [
	{ key: 'id', label: 'Document ID' },
	{ key: 'ip', label: 'IP' },
	{
		key: 'visitorDeviceId',
		label: 'Anonymous device ID (first-party UUID)',
	},
	{ key: 'city', label: 'City' },
	{ key: 'region', label: 'Region' },
	{ key: 'country', label: 'Country' },
	{ key: 'countryCode', label: 'Country code' },
	{ key: 'latitude', label: 'Latitude' },
	{ key: 'longitude', label: 'Longitude' },
	{ key: 'isp', label: 'ISP / org' },
	{ key: 'timezone', label: 'Timezone' },
	{ key: 'browser', label: 'Browser' },
	{ key: 'os', label: 'Operating system' },
	{ key: 'deviceType', label: 'Device type' },
	{ key: 'referrer', label: 'Referrer' },
	{ key: 'language', label: 'Accept-Language' },
	{ key: 'path', label: 'Path' },
	{ key: 'visitedAt', label: 'First visited' },
	{ key: 'lastSeen', label: 'Last seen' },
	{ key: 'visitCount', label: 'Visit count' },
];

type VisitorDetailDialogProps = {
	visitor: VisitorSerializable | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
};

export function VisitorDetailDialog({
	visitor,
	open,
	onOpenChange,
}: VisitorDetailDialogProps) {
	const v = visitor;

	return (
		<Dialog modal={false} open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-h-[88vh] max-w-2xl overflow-y-auto sm:max-w-2xl'>
				{!v ? null : (
					<>
						<DialogHeader>
							<DialogTitle className='break-all font-mono text-base'>
								{v.ip}
								{v.countryCode ? (
									<span className='ml-2 align-middle font-sans text-2xl' aria-hidden>
										{countryCodeToFlagEmoji(v.countryCode)}
									</span>
								) : null}
							</DialogTitle>
							<DialogDescription className='text-left'>
								Full visitor record captured by the `/api/info` pipeline.
							</DialogDescription>
						</DialogHeader>
						<dl className='divide-y rounded-md border text-sm'>
							{ROWS.filter((row) => row.key !== 'userAgent').map(({ key, label }) => (
								<div
									key={key}
									className='grid gap-1 px-3 py-2 sm:grid-cols-[170px_minmax(0,1fr)] sm:gap-4'>
									<dt className='font-medium text-muted-foreground'>{label}</dt>
									<dd className='min-w-0 break-words font-medium'>
										{renderValue(v, key)}
									</dd>
								</div>
							))}
							<div className='grid gap-2 px-3 py-3 sm:grid-cols-[170px_minmax(0,1fr)]'>
								<dt className='font-medium text-muted-foreground'>User-Agent</dt>
								<dd className='min-w-0'>
									<pre className='whitespace-pre-wrap break-all rounded-md bg-muted/50 p-2 text-xs font-mono leading-relaxed'>
										{v.userAgent || '—'}
									</pre>
								</dd>
							</div>
						</dl>
					</>
				)}
			</DialogContent>
		</Dialog>
	);
}

function renderValue(v: VisitorSerializable, key: keyof VisitorSerializable) {
	switch (key) {
		case 'latitude':
		case 'longitude':
			return v[key] === null || v[key] === undefined
				? '—'
				: String(v[key]);
		case 'visitCount':
			return String(v.visitCount.toLocaleString());
		case 'visitedAt':
		case 'lastSeen':
			return fmtDt(v[key]);
		case 'referrer':
			return v.referrer ? (
				<a className='text-primary underline underline-offset-2' href={v.referrer}>
					{v.referrer}
				</a>
			) : (
				'—'
			);
		case 'countryCode':
			return v.countryCode?.trim()
				? `${v.countryCode} ${countryCodeToFlagEmoji(v.countryCode)}`
				: '—';
		default:
			return (v[key] as string)?.toString()?.trim() !== ''
				? String(v[key])
				: '—';
	}
}
