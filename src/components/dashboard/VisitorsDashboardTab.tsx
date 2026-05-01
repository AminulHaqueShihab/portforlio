'use client';

import { TableFilters } from '@/components/dashboard/TableFilters';
import VisitorsTable from '@/components/dashboard/VisitorsTable';
import { useDebouncedValue } from '@/hooks/use-debounced-value';
import type { SortableVisitorKey } from '@/lib/visitors-query';
import {
	useGetVisitorsQuery,
	useGetVisitorStatsQuery,
} from '@/store/visitorsApi';
import { useEffect, useMemo, useState } from 'react';

const LIMIT = 20;

export function VisitorsDashboardTab() {
	const [page, setPage] = useState(1);
	const [searchDraft, setSearchDraft] = useState('');
	const debouncedSearch = useDebouncedValue(searchDraft, 300);

	const [sortBy, setSortBy] = useState<SortableVisitorKey>('lastSeen');
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

	const isRefreshing = visitorsQuery.isFetching || statsQuery.isFetching;

	const baseIndex = useMemo(() => (page - 1) * LIMIT, [page]);

	return (
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
				isLoading={visitorsQuery.isLoading}
				skeletonRowCount={LIMIT}
				onSortChange={(col, ord) => {
					setSortBy(col);
					setSortOrder(ord);
					setPage(1);
				}}
			/>
		</div>
	);
}
