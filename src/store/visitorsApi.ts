import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { VisitorStatsPayload } from '@/lib/visitor-stats-types';

import type { VisitorsListResponse } from '@/lib/visitors-query';

export type GetVisitorsArgs = {
	page: number;
	limit: number;
	search: string;
	sortBy: VisitorsListResponse['sortBy'];
	sortOrder: VisitorsListResponse['sortOrder'];
};

export const visitorsApi = createApi({
	reducerPath: 'visitorsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '',
		credentials: 'include',
	}),
	tagTypes: ['Visitor', 'VisitorStats'],
	endpoints: (build) => ({
		getVisitors: build.query<VisitorsListResponse, GetVisitorsArgs>({
			query: ({ page, limit, search, sortBy, sortOrder }) => ({
				url: '/api/visitors',
				params: {
					page,
					limit,
					search: search.trim() === '' ? undefined : search.trim(),
					sortBy,
					sortOrder,
				},
			}),
			providesTags: (result, _error, arg) => {
				const list = [{ type: 'Visitor' as const, id: 'LIST' }] as const;
				if (!result?.visitors) return [...list];
				return [
					...result.visitors.map((v) => ({
						type: 'Visitor' as const,
						id: v.id,
					})),
					...list,
				];
			},
			serializeQueryArgs: ({ queryArgs }) => {
				const { page, limit, search, sortBy, sortOrder } = queryArgs;
				return `${page}-${limit}-${search}-${sortBy}-${sortOrder}`;
			},
		}),
		getVisitorStats: build.query<VisitorStatsPayload, void>({
			query: () => ({
				url: '/api/visitors/stats',
			}),
			providesTags: () => [{ type: 'VisitorStats', id: 'STATS' }] as const,
		}),
		deleteVisitor: build.mutation<void, string>({
			query: (id) => ({
				url: `/api/visitors/${encodeURIComponent(id)}`,
				method: 'DELETE',
			}),
			invalidatesTags: (_result, error, id) =>
				error
					? []
					: [
							{ type: 'Visitor', id },
							{ type: 'Visitor', id: 'LIST' },
							{ type: 'VisitorStats', id: 'STATS' },
						],
		}),
		bulkDeleteVisitors: build.mutation<
			{ ok: boolean; deletedCount: number },
			string[]
		>({
			query: (ids) => ({
				url: '/api/visitors/bulk-delete',
				method: 'POST',
				body: { ids },
			}),
			invalidatesTags: (_r, error) =>
				error
					? []
					: [
							{ type: 'Visitor', id: 'LIST' },
							{ type: 'VisitorStats', id: 'STATS' },
						],
		}),
	}),
});

export const {
	useGetVisitorsQuery,
	useGetVisitorStatsQuery,
	useLazyGetVisitorsQuery,
	useDeleteVisitorMutation,
	useBulkDeleteVisitorsMutation,
} = visitorsApi;
