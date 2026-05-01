'use client';

import { StatCards } from '@/components/dashboard/StatCards';
import { TableFilters } from '@/components/dashboard/TableFilters';
import VisitorsTable from '@/components/dashboard/VisitorsTable';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { SortableVisitorKey } from '@/lib/visitors-query';
import {
	useDeleteAllVisitorsMutation,
	useGetVisitorsQuery,
	useGetVisitorStatsQuery,
} from '@/store/visitorsApi';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

const LIMIT = 20;

export default function DashboardHomePage() {
	const router = useRouter();

	const [page, setPage] = useState(1);
	const [searchDraft, setSearchDraft] = useState('');
	const debouncedSearch = useDebouncedValue(searchDraft, 300);

	const [sortBy, setSortBy] = useState<SortableVisitorKey>('visitedAt');
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

	useEffect(() => {
		setPage(1);
	}, [debouncedSearch]);

	const visitorsQuery = useGetVisitorsQuery({
		page,
		limit: LIMIT,
		search: debouncedSearch,
		sortBy,
		sortOrder,
	});

	const statsQuery = useGetVisitorStatsQuery();

	const [deleteAll, deleteState] = useDeleteAllVisitorsMutation();

	const isRefreshing = visitorsQuery.isFetching || statsQuery.isFetching;

	const baseIndex = useMemo(() => (page - 1) * LIMIT, [page]);

	async function handleLogout() {
		try {
			await fetch('/api/auth/logout', {
				method: 'POST',
				credentials: 'include',
			});
			router.replace('/dashboard/login');
			router.refresh();
		} catch {
			router.replace('/dashboard/login');
		}
	}

	return (
		<div className='space-y-10'>
			<div className='space-y-2'>
				<h1 className='text-3xl font-semibold tracking-tight'>
					Visitor analytics
				</h1>
				<p className='max-w-prose text-sm text-muted-foreground'>
					This dashboard summarizes portfolio traffic captured from the public API
					route — data is intentionally excluded while you browse these admin
					pages.
				</p>
			</div>

			<StatCards stats={statsQuery.data} />

			<div className='space-y-6'>
				<TableFilters
					value={searchDraft}
					onChange={setSearchDraft}
					onRefresh={() => {
						void visitorsQuery.refetch();
						void statsQuery.refetch();
					}}
					isRefreshing={isRefreshing}
				/>

				<VisitorsTable
					baseIndex={baseIndex}
					rows={visitorsQuery.data?.visitors ?? []}
					total={visitorsQuery.data?.total ?? 0}
					page={visitorsQuery.data?.page ?? page}
					totalPages={visitorsQuery.data?.totalPages ?? 1}
					onPageChange={setPage}
					sortBy={sortBy}
					sortOrder={sortOrder}
					onSortChange={(col, ord) => {
						setSortBy(col);
						setSortOrder(ord);
						setPage(1);
					}}
					onDeleteAllRequested={async () => {
						try {
							await deleteAll().unwrap();
							setPage(1);
						} catch {
							// RTK exposes errors via mutationState for UI refinement later.
						}
					}}
					isDeleting={deleteState.isLoading}
					onLogout={handleLogout}
				/>
			</div>
		</div>
	);
}
