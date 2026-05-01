'use client';

import { INTERACTION_SESSION_STORAGE_KEY } from '@/lib/analytics-session';
import { VISITOR_DEVICE_STORAGE_KEY } from '@/lib/visitor-device-id';
import { nanoid } from 'nanoid';
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
} from 'react';

export type InteractionEventPayload = {
	visitorDeviceId?: string;
	sessionId: string;
	type:
		| 'click'
		| 'project_click'
		| 'section_view'
		| 'page_duration'
		| 'scroll_depth';
	label?: string;
	path: string;
	value?: number;
	metadata?: Record<string, unknown>;
	timestamp: string;
};

function getSessionId(): string {
	if (typeof window === 'undefined') return '';
	try {
		let sid = sessionStorage.getItem(INTERACTION_SESSION_STORAGE_KEY);
		if (!sid) {
			sid = nanoid();
			sessionStorage.setItem(INTERACTION_SESSION_STORAGE_KEY, sid);
		}
		return sid;
	} catch {
		return nanoid();
	}
}

function readVisitorDeviceId(): string | undefined {
	if (typeof window === 'undefined') return undefined;
	try {
		const raw = window.localStorage.getItem(VISITOR_DEVICE_STORAGE_KEY);
		if (!raw?.trim()) return undefined;
		return raw.trim().slice(0, 36);
	} catch {
		return undefined;
	}
}

function postPayloadJson(bodyJson: string, useBeacon: boolean): boolean {
	const url =
		typeof window !== 'undefined'
			? `${window.location.origin}/api/events`
			: '/api/events';
	if (
		useBeacon &&
		typeof navigator !== 'undefined' &&
		navigator.sendBeacon
	) {
		const blob = new Blob([bodyJson], { type: 'text/plain;charset=UTF-8' });
		return navigator.sendBeacon(url, blob);
	}
	void fetch(url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: bodyJson,
		// Survives soft navigations / tab lifecycle better than default fetch
		keepalive: true,
	}).catch(() => null);
	return true;
}

export function useInteractionTracker() {
	const queueRef = useRef<InteractionEventPayload[]>([]);
	const flushingRef = useRef(false);

	const sessionId = useMemo(() => getSessionId(), []);

	const flushInternal = useCallback(async (preferBeacon: boolean) => {
		if (typeof window === 'undefined' || flushingRef.current) return;
		const pending = queueRef.current;
		if (pending.length === 0) return;
		flushingRef.current = true;
		queueRef.current = [];
		const bodyJson = JSON.stringify({ events: pending });
		postPayloadJson(bodyJson, preferBeacon);
		flushingRef.current = false;
		if (queueRef.current.length > 0) {
			void flushInternal(preferBeacon);
		}
	}, []);

	useEffect(() => {
		const onInterval = () => {
			void flushInternal(false);
		};
		const id = window.setInterval(onInterval, 10_000);

		const onVis = () => {
			if (document.hidden) {
				void flushInternal(true);
			}
		};
		const onUnload = () => {
			void flushInternal(true);
		};

		document.addEventListener('visibilitychange', onVis);
		window.addEventListener('beforeunload', onUnload);
		window.addEventListener('pagehide', onUnload);

		return () => {
			window.clearInterval(id);
			document.removeEventListener('visibilitychange', onVis);
			window.removeEventListener('beforeunload', onUnload);
			window.removeEventListener('pagehide', onUnload);
		};
	}, [flushInternal]);

	type EnqueueInput = Omit<
		InteractionEventPayload,
		'timestamp' | 'sessionId' | 'visitorDeviceId'
	> & { highPriority?: boolean; path?: string };

	const enqueue = useCallback(
		(payload: EnqueueInput) => {
			const { highPriority, ...rest } = payload;
				const visitorDeviceId = readVisitorDeviceId();
			const event: InteractionEventPayload = {
				...rest,
				sessionId,
				path:
					typeof window !== 'undefined'
						? window.location.pathname
						: rest.path,
				timestamp: new Date().toISOString(),
				...(visitorDeviceId ? { visitorDeviceId } : {}),
			};
			queueRef.current.push(event);
			if (highPriority) {
				void flushInternal(false);
			}
		},
		[flushInternal, sessionId]
	);

	const trackClick = useCallback(
		(label: string, metadata?: object) => {
			enqueue({
				type: 'click',
				label,
				path:
					typeof window !== 'undefined'
						? window.location.pathname
						: '/',
				metadata: metadata ? { ...(metadata as Record<string, unknown>) } : undefined,
				highPriority: true,
			});
		},
		[enqueue]
	);

	const trackProjectClick = useCallback(
		(projectName: string, projectId?: string, href?: string) => {
			enqueue({
				type: 'project_click',
				label: projectName,
				path:
					typeof window !== 'undefined'
						? window.location.pathname
						: '/',
				metadata: {
					...(projectId ? { projectId } : {}),
					...(href ? { href } : {}),
				},
				highPriority: true,
			});
		},
		[enqueue]
	);

	const trackSectionView = useCallback(
		(sectionId: string, durationSeconds: number) => {
			enqueue({
				type: 'section_view',
				label: `Section: ${sectionId}`,
				path:
					typeof window !== 'undefined'
						? window.location.pathname
						: '/',
				value: durationSeconds,
				metadata: { sectionId },
				highPriority: false,
			});
		},
		[enqueue]
	);

	const trackPageDuration = useCallback(
		(durationSeconds: number) => {
			if (durationSeconds <= 0) return;
			enqueue({
				type: 'page_duration',
				path:
					typeof window !== 'undefined'
						? window.location.pathname
						: '/',
				value: durationSeconds,
				highPriority: false,
			});
		},
		[enqueue]
	);

	const trackScrollDepth = useCallback(
		(percent: 25 | 50 | 75 | 100) => {
			enqueue({
				type: 'scroll_depth',
				path:
					typeof window !== 'undefined'
						? window.location.pathname
						: '/',
				value: percent,
				metadata: { scrollPercent: percent },
				highPriority: false,
			});
		},
		[enqueue]
	);

	const flushNow = useCallback(
		async (preferBeacon = false) => {
			await flushInternal(preferBeacon);
		},
		[flushInternal]
	);

	return {
		sessionId,
		trackClick,
		trackProjectClick,
		trackSectionView,
		trackPageDuration,
		trackScrollDepth,
		flushNow,
	};
}
