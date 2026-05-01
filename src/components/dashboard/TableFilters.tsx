'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Search } from 'lucide-react';

type TableFiltersProps = {
	value: string;
	onChange: (next: string) => void;
	onRefresh: () => void;
	isRefreshing: boolean;
};

export function TableFilters({
	value,
	onChange,
	onRefresh,
	isRefreshing,
}: TableFiltersProps) {
	return (
		<div className='flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
			<div className='grid w-full max-w-xl gap-2'>
				<Label htmlFor='visitor-search'>Search</Label>
				<div className='relative'>
					<Search className='pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground' />
					<Input
						id='visitor-search'
						className='pl-9'
						placeholder='Filter by IP, country, or city…'
						value={value}
						onChange={(e) => onChange(e.target.value)}
						autoComplete='off'
					/>
				</div>
			</div>
			<Button
				type='button'
				variant='outline'
				onClick={onRefresh}
				disabled={isRefreshing}
				className='sm:self-end'>
				<RefreshCw
					className={`mr-2 h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`}
				/>
				Refresh
			</Button>
		</div>
	);
}
