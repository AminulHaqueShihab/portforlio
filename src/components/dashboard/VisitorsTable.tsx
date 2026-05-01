'use client';

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious,
} from '@/components/ui/pagination';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { VisitorDetailDialog } from '@/components/dashboard/VisitorDetailDialog';
import { countryCodeToFlagEmoji } from '@/lib/country-flag-emoji';
import type { SortableVisitorKey, VisitorSerializable } from '@/lib/visitors-query';
import {
	useBulkDeleteVisitorsMutation,
	useDeleteVisitorMutation,
} from '@/store/visitorsApi';
import {
	ArrowDown,
	ArrowDownUp,
	ArrowUp,
	Eye,
	MoreHorizontal,
	Trash2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { type ReactNode, useCallback, useMemo, useState } from 'react';

function formatVisitedAt(iso: string): string {
	try {
		return format(parseISO(iso), 'MMM d, yyyy · h:mm aa');
	} catch {
		return iso;
	}
}

function buildPageNumbers(
	current: number,
	totalPages: number
): Array<number | 'ellipsis'> {
	if (totalPages <= 7) {
		return Array.from({ length: totalPages }, (_, i) => i + 1);
	}

	const items = new Set<number>();
	items.add(1);
	items.add(totalPages);
	items.add(current);
	items.add(current - 1);
	items.add(current + 1);

	const sorted = Array.from(items)
		.filter((n) => n >= 1 && n <= totalPages)
		.sort((a, b) => a - b);

	const out: Array<number | 'ellipsis'> = [];
	let prev = 0;

	for (const n of sorted) {
		if (prev && n - prev > 1) out.push('ellipsis');
		out.push(n);
		prev = n;
	}

	return out;
}

function EllipsisText({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	return (
		<span className={className} title={text}>
			{text}
		</span>
	);
}

type SortHeaderProps = {
	label: string;
	column: SortableVisitorKey;
	active: SortableVisitorKey;
	order: 'asc' | 'desc';
	onSort: (column: SortableVisitorKey) => void;
};

function SortHeader({ label, column, active, order, onSort }: SortHeaderProps) {
	const isActive = active === column;
	let icon: ReactNode = (
		<ArrowDownUp className='ml-1 inline h-3.5 w-3.5 text-muted-foreground' />
	);
	if (isActive) {
		icon =
			order === 'asc' ? (
				<ArrowUp className='ml-1 inline h-3.5 w-3.5' />
			) : (
				<ArrowDown className='ml-1 inline h-3.5 w-3.5' />
			);
	}

	return (
		<button
			type='button'
			onClick={() => onSort(column)}
			className='inline-flex items-center rounded-md px-1 py-0.5 font-medium text-muted-foreground hover:bg-muted hover:text-foreground'>
			{label}
			<span className='sr-only'>
				current sort{' '}
				{isActive ? (order === 'asc' ? 'ascending' : 'descending') : 'none'}
			</span>
			{icon}
		</button>
	);
}

export type VisitorsTableProps = {
	baseIndex: number;
	rows: VisitorSerializable[];
	total: number;
	page: number;
	totalPages: number;
	onPageChange: (next: number) => void;

	sortBy: SortableVisitorKey;
	sortOrder: 'asc' | 'desc';
	onSortChange: (column: SortableVisitorKey, order: 'asc' | 'desc') => void;
};

export default function VisitorsTable({
	baseIndex,
	rows,
	total,
	page,
	totalPages,
	onPageChange,
	sortBy,
	sortOrder,
	onSortChange,
}: VisitorsTableProps) {
	const [selected, setSelected] = useState<Set<string>>(() => new Set());
	const [detailVisitor, setDetailVisitor] =
		useState<VisitorSerializable | null>(null);
	const [detailDialogOpen, setDetailDialogOpen] = useState(false);
	const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
	const [singleDeleteTarget, setSingleDeleteTarget] =
		useState<VisitorSerializable | null>(null);
	const [singleDeleteOpen, setSingleDeleteOpen] = useState(false);

	const [deleteOne, deleteOneState] = useDeleteVisitorMutation();
	const [bulkDelete, bulkDeleteState] = useBulkDeleteVisitorsMutation();

	const pageIds = useMemo(() => rows.map((r) => r.id), [rows]);

	const headerChecked = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
	const headerIndeterminate =
		pageIds.some((id) => selected.has(id)) && !headerChecked;

	function toggleSort(column: SortableVisitorKey) {
		if (sortBy === column) {
			onSortChange(column, sortOrder === 'asc' ? 'desc' : 'asc');
			return;
		}

		const defaultDesc: SortableVisitorKey[] = ['visitedAt', 'lastSeen', 'visitCount'];
		const nextOrder: 'asc' | 'desc' = defaultDesc.includes(column)
			? 'desc'
			: 'asc';
		onSortChange(column, nextOrder);
	}

	const toggleSelected = useCallback((id: string, next: boolean) => {
		setSelected((prev) => {
			const n = new Set(prev);
			if (next) n.add(id);
			else n.delete(id);
			return n;
		});
	}, []);

	const toggleSelectPage = useCallback(
		(checked: boolean) => {
			setSelected((prev) => {
				const n = new Set(prev);
				if (checked) {
					for (const id of pageIds) n.add(id);
				} else {
					for (const id of pageIds) n.delete(id);
				}
				return n;
			});
		},
		[pageIds]
	);

	const selectedCount = selected.size;
	const pageItems = buildPageNumbers(page, totalPages);

	async function handleBulkDeleteConfirmed() {
		const ids = Array.from(selected);
		if (!ids.length) {
			setBulkDeleteOpen(false);
			return;
		}
		try {
			await bulkDelete(ids).unwrap();
			setSelected(new Set());
		} catch {
			//
		} finally {
			setBulkDeleteOpen(false);
		}
	}

	async function handleSingleDeleteConfirmed() {
		const v = singleDeleteTarget;
		if (!v) return;
		try {
			await deleteOne(v.id).unwrap();
			setSelected((prev) => {
				const n = new Set(prev);
				n.delete(v.id);
				return n;
			});
		} catch {
			//
		} finally {
			setSingleDeleteOpen(false);
			window.setTimeout(() => setSingleDeleteTarget(null), 350);
		}
	}

	return (
		<div className='space-y-4'>
			<div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
				<div className='text-sm text-muted-foreground'>
					Showing{' '}
					<span className='font-medium text-foreground'>
						{total === 0 ? 0 : baseIndex + 1}–{baseIndex + rows.length}
					</span>{' '}
					of <span className='font-medium text-foreground'>{total}</span>
					{selectedCount > 0 ? (
						<span className='ml-3 text-foreground'>
							·{' '}
							<span className='font-medium tabular-nums'>{selectedCount}</span>{' '}
							selected
						</span>
					) : null}
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					<Button
						type='button'
						variant='outline'
						className='gap-2 border-destructive/60 text-destructive hover:bg-destructive/10 hover:text-destructive'
						disabled={selectedCount === 0 || bulkDeleteState.isLoading}
						onClick={() => setBulkDeleteOpen(true)}>
						<Trash2 className='h-4 w-4' />
						Delete selected
					</Button>
					<AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
						<AlertDialogContent>
							<AlertDialogHeader>
								<AlertDialogTitle>Delete selected visitors?</AlertDialogTitle>
								<AlertDialogDescription>
									Permanently delete{' '}
									<span className='font-semibold text-foreground'>
										{selectedCount}
									</span>{' '}
									record(s) from MongoDB? This cannot be undone.
								</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel type='button'>Cancel</AlertDialogCancel>
								<AlertDialogAction
									type='button'
									className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
									onClick={() => void handleBulkDeleteConfirmed()}>
									Delete
								</AlertDialogAction>
							</AlertDialogFooter>
						</AlertDialogContent>
					</AlertDialog>
				</div>
			</div>

			<div className='overflow-x-auto rounded-md border'>
				<div className='min-w-[1340px]'>
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className='w-10'>
									<Checkbox
										aria-label='Select all on this page'
										checked={
											headerIndeterminate ? 'indeterminate' : headerChecked
										}
										onCheckedChange={(v) => toggleSelectPage(v === true)}
									/>
								</TableHead>
								<TableHead className='w-[44px]' aria-label='Row number'>
									#
								</TableHead>
								<TableHead>
									<SortHeader
										label='IP'
										column='ip'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='Device ID'
										column='visitorDeviceId'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='Country'
										column='country'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='City'
										column='city'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='ISP'
										column='isp'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='Browser'
										column='browser'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='OS'
										column='os'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='Device'
										column='deviceType'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='Visits'
										column='visitCount'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead>
									<SortHeader
										label='Path'
										column='path'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead className='min-w-[165px]'>
									<SortHeader
										label='Visited at'
										column='lastSeen'
										active={sortBy}
										order={sortOrder}
										onSort={toggleSort}
									/>
								</TableHead>
								<TableHead className='w-[56px]' aria-label='Row actions'>
									<span className='sr-only'>Actions</span>
								</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.length === 0 ? (
								<TableRow>
									<TableCell colSpan={14} className='h-24 text-center'>
										No visitor records matched your filters yet.
									</TableCell>
								</TableRow>
							) : (
								rows.map((visitor, idx) => (
									<TableRow key={visitor.id}>
										<TableCell>
											<Checkbox
												aria-label={`Select ${visitor.ip}`}
												checked={selected.has(visitor.id)}
												onCheckedChange={(v) =>
													toggleSelected(visitor.id, v === true)
												}
											/>
										</TableCell>
										<TableCell className='text-muted-foreground'>
											{baseIndex + idx + 1}
										</TableCell>
										<TableCell className='font-mono text-xs'>
											<EllipsisText text={visitor.ip} className='block max-w-[160px] truncate' />
										</TableCell>
										<TableCell className='font-mono text-xs'>
											<EllipsisText
												text={visitor.visitorDeviceId || '—'}
												className='block max-w-[120px] truncate'
											/>
										</TableCell>
										<TableCell>
											<span className='inline-flex max-w-[200px] items-center gap-2'>
												<span className='text-lg' aria-hidden>
													{countryCodeToFlagEmoji(visitor.countryCode)}
												</span>
												<EllipsisText
													text={(visitor.country || visitor.countryCode || '—').toString()}
													className='truncate'
												/>
											</span>
										</TableCell>
										<TableCell>
											<EllipsisText text={visitor.city || '—'} className='block max-w-[140px] truncate' />
										</TableCell>
										<TableCell>
											<EllipsisText text={visitor.isp || '—'} className='block max-w-[220px] truncate' />
										</TableCell>
										<TableCell>
											<EllipsisText text={visitor.browser || '—'} className='block max-w-[180px] truncate' />
										</TableCell>
										<TableCell>
											<EllipsisText text={visitor.os || '—'} className='block max-w-[160px] truncate' />
										</TableCell>
										<TableCell className='capitalize'>{visitor.deviceType}</TableCell>
										<TableCell className='text-right tabular-nums font-medium'>
											{visitor.visitCount.toLocaleString()}
										</TableCell>
										<TableCell>
											<EllipsisText text={visitor.path || '—'} className='block max-w-[220px] truncate font-mono text-xs' />
										</TableCell>
										<TableCell className='whitespace-nowrap text-xs'>
											{formatVisitedAt(visitor.lastSeen)}
										</TableCell>
										<TableCell className='w-[56px] text-right'>
											<DropdownMenu modal={false}>
												<DropdownMenuTrigger asChild>
													<Button
														type='button'
														size='icon'
														variant='ghost'
														className='h-9 w-9'
														disabled={deleteOneState.isLoading}
														aria-label={`Actions for visitor ${visitor.ip}`}>
														<MoreHorizontal className='h-4 w-4' />
													</Button>
												</DropdownMenuTrigger>
												<DropdownMenuContent align='end' className='w-44'>
													<DropdownMenuItem
														className='gap-2'
														onSelect={(e) => {
															e.preventDefault();
															window.setTimeout(() => {
																setDetailVisitor(visitor);
																setDetailDialogOpen(true);
															}, 0);
														}}>
														<Eye className='h-4 w-4' />
														View details
													</DropdownMenuItem>
													<DropdownMenuSeparator />
													<DropdownMenuItem
														className='gap-2 text-destructive focus:text-destructive'
														disabled={deleteOneState.isLoading}
														onSelect={(e) => {
															e.preventDefault();
															window.setTimeout(() => {
																setSingleDeleteTarget(visitor);
																setSingleDeleteOpen(true);
															}, 0);
														}}>
														<Trash2 className='h-4 w-4' />
														Delete…
													</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<Pagination>
				<PaginationContent className='flex-wrap'>
					<PaginationItem>
						<PaginationPrevious
							disabled={page <= 1}
							onClick={() => {
								onPageChange(page - 1);
							}}
						/>
					</PaginationItem>

					{pageItems.map((item, idx) => (
						<PaginationItem key={`${idx}-${item}`}>
							{item === 'ellipsis' ? (
								<PaginationEllipsis />
							) : (
								<PaginationLink
									isActive={item === page}
									size='default'
									className='min-w-10'
									onClick={() => onPageChange(item)}
									aria-label={`Page ${item}`}>
									{item}
								</PaginationLink>
							)}
						</PaginationItem>
					))}

					<PaginationItem>
						<PaginationNext
							disabled={page >= totalPages}
							onClick={() => onPageChange(page + 1)}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			{totalPages > 7 ? (
				<p className='text-xs text-muted-foreground'>
					Pagination summarizes long ranges with ellipses. Current page{' '}
					<span className='font-medium text-foreground'>{page}</span> of{' '}
					<span className='font-medium text-foreground'>{totalPages}</span>.
				</p>
			) : null}

			{(detailDialogOpen || detailVisitor !== null) ? (
				<VisitorDetailDialog
					visitor={detailVisitor}
					open={detailDialogOpen}
					onOpenChange={(next) => {
						setDetailDialogOpen(next);
						if (!next) {
							window.setTimeout(() => setDetailVisitor(null), 350);
						}
					}}
				/>
			) : null}

			{(singleDeleteOpen || singleDeleteTarget !== null) ? (
				<AlertDialog
					open={singleDeleteOpen}
					onOpenChange={(next) => {
						setSingleDeleteOpen(next);
						if (!next) {
							window.setTimeout(() => setSingleDeleteTarget(null), 350);
						}
					}}>
					<AlertDialogContent>
						<AlertDialogHeader>
							<AlertDialogTitle>Delete this visitor?</AlertDialogTitle>
							<AlertDialogDescription>
								Remove this record for{' '}
								<span className='font-mono font-medium text-foreground'>
									{singleDeleteTarget?.ip}
								</span>{' '}
								permanently? This cannot be undone.
							</AlertDialogDescription>
						</AlertDialogHeader>
						<AlertDialogFooter>
							<AlertDialogCancel type='button'>Cancel</AlertDialogCancel>
							<AlertDialogAction
								type='button'
								className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
								onClick={() => void handleSingleDeleteConfirmed()}>
								Delete
							</AlertDialogAction>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			) : null}
		</div>
	);
}
