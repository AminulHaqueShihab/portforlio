import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import type { EventStatsPayload } from '@/lib/event-stats-types';
import type { EventsListResponse } from '@/lib/events-list-types';
import type { VisitorStatsPayload } from '@/lib/visitor-stats-types';

import type { VisitorsListResponse } from '@/lib/visitors-query';

export type GetVisitorsArgs = {
	page: number;
	limit: number;
	search: string;
	sortBy: VisitorsListResponse['sortBy'];
	sortOrder: VisitorsListResponse['sortOrder'];
};

export type GetEventsArgs = {
	page: number;
	limit: number;
	type?: string;
	path?: string;
	from?: string;
	to?: string;
};

export const visitorsApi = createApi({
	reducerPath: 'visitorsApi',
	baseQuery: fetchBaseQuery({
		baseUrl: '',
		credentials: 'include',
	}),
	tagTypes: ['Visitor', 'VisitorStats', 'Event', 'EventStats'],
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
		getEvents: build.query<EventsListResponse, GetEventsArgs>({
			query: ({ page, limit, type, path, from, to }) => ({
				url: '/api/events',
				params: {
					page,
					limit,
					...(type ? { type } : {}),
					...(path ? { path } : {}),
					...(from ? { from } : {}),
					...(to ? { to } : {}),
				},
			}),
			providesTags: (result) => {
				const list = [{ type: 'Event' as const, id: 'LIST' }] as const;
				if (!result?.events?.length) return [...list];
				return [
					...result.events.map((e) => ({
						type: 'Event' as const,
						id: e.id,
					})),
					...list,
				];
			},
			serializeQueryArgs: ({ queryArgs }) =>
				`${queryArgs.page}-${queryArgs.limit}-${queryArgs.type ?? ''}-${queryArgs.path ?? ''}-${queryArgs.from ?? ''}-${queryArgs.to ?? ''}`,
		}),
		getEventStats: build.query<EventStatsPayload, void>({
			query: () => ({
				url: '/api/events/stats',
			}),
			providesTags: () =>
				[{ type: 'EventStats', id: 'STATS' }] as const,
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
	useGetEventsQuery,
	useGetEventStatsQuery,
	useLazyGetVisitorsQuery,
	useDeleteVisitorMutation,
	useBulkDeleteVisitorsMutation,
} = visitorsApi;
