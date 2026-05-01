'use client';

import { useInteractionTracker } from '@/hooks/useInteractionTracker';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

const LINK_SELECTOR = 'a[href], area[href]';
const BUTTON_SELECTOR =
	'button, [role="button"], summary, input[type="button"], input[type="submit"], input[type="reset"], input[type="image"]';

/** Native click target as an Element (handles text-node targets). */
function clickTargetElement(ev: MouseEvent): Element | null {
	const raw = ev.target;
	if (raw instanceof Element) return raw;
	if (raw instanceof Text && raw.parentElement) return raw.parentElement;
	return null;
}

function isDisabledControl(el: Element): boolean {
	if (
		el instanceof HTMLButtonElement ||
		el instanceof HTMLInputElement ||
		el instanceof HTMLSelectElement ||
		el instanceof HTMLTextAreaElement
	) {
		if (el.disabled) return true;
	}
	if (el.getAttribute('aria-disabled') === 'true') return true;
	return false;
}

/** Prefer human-readable text; always returns a non-empty fallback for analytics. */
function deriveInteractiveLabel(el: Element): string {
	const aria = el.getAttribute('aria-label')?.trim();
	if (aria) return aria.slice(0, 240);
	const titleAttr = el.getAttribute('title')?.trim();
	const text = el.textContent?.replace(/\s+/g, ' ').trim();
	if (text) return text.slice(0, 240);
	if (titleAttr) return titleAttr.slice(0, 240);

	if (el instanceof HTMLInputElement) {
		const typ = el.type.toLowerCase();
		const val = typeof el.value === 'string' ? el.value.trim() : '';
		if (val && (typ === 'button' || typ === 'submit' || typ === 'reset'))
			return val.slice(0, 240);
		const alt = el.alt?.trim();
		if (alt && typ === 'image') return alt.slice(0, 240);
		if (typ === 'submit') return el.name?.trim() ? el.name : 'Submit';
		if (typ === 'reset') return el.name?.trim() ? el.name : 'Reset';
		if (typ === 'button')
			return el.name?.trim() ? el.name : 'Button';
		if (typ === 'image') return 'Image button';
	}

	if (el instanceof HTMLAnchorElement && el.hasAttribute('href')) {
		try {
			const base =
				typeof window !== 'undefined' ? window.location.href : undefined;
			const u = new URL(el.href, base);
			const sameOrigin =
				typeof window !== 'undefined' && u.origin === window.location.origin;
			const frag = `${u.pathname}${u.search}${u.hash}`;
			if (frag && frag !== '/') return frag.slice(0, 200);
			if (!sameOrigin) {
				const ext = `${u.hostname}${u.pathname}${u.search}${u.hash}`;
				if (ext && ext !== '/') return ext.slice(0, 200);
			}
		} catch {
			/* fall through */
		}
		const href = el.getAttribute('href');
		if (href) return href.slice(0, 200);
	}

	if (el instanceof HTMLAreaElement) {
		const alt = el.alt?.trim();
		if (alt) return alt.slice(0, 240);
		if (el.href) {
			try {
				return new URL(el.href, typeof window !== 'undefined' ? window.location.href : undefined)
					.pathname.slice(0, 200);
			} catch {
				return el.getAttribute('href')?.slice(0, 200) ?? 'Area link';
			}
		}
		return 'Area link';
	}

	if (el.matches('summary')) return 'Details toggle';

	const id = el.id?.trim();
	if (id) return `#${id.slice(0, 80)}`;

	if (el.matches('[role="button"]')) return '[Button control]';

	if (el.matches('button')) return '[Button]';

	return '[Click]';
}

/**
 * Mounted once alongside VisitorTracker — records engagement on public pages only.
 */
export default function InteractionTracker() {
	const pathname = usePathname();
	const dashboard = pathname.startsWith('/dashboard');
	const {
		trackClick,
		trackProjectClick,
		trackSectionView,
		trackPageDuration,
		trackScrollDepth,
	} = useInteractionTracker();

	useEffect(() => {
		if (dashboard) return;

		let anchor = Date.now();
		let segmentActive =
			typeof document !== 'undefined' && !document.hidden;

		const emitSegment = () => {
			if (!segmentActive) return;
			const sec = (Date.now() - anchor) / 1000;
			if (sec > 0.5) {
				trackPageDuration(sec);
			}
		};

		function startNewSegment() {
			anchor = Date.now();
			segmentActive =
				typeof document !== 'undefined' && !document.hidden;
		}

		function onVisibility() {
			if (document.hidden) {
				emitSegment();
				segmentActive = false;
			} else {
				startNewSegment();
			}
		}

		function flushOnLeave() {
			emitSegment();
		}

		startNewSegment();

		document.addEventListener('visibilitychange', onVisibility);
		window.addEventListener('pagehide', flushOnLeave);
		window.addEventListener('beforeunload', flushOnLeave);

		return () => {
			document.removeEventListener('visibilitychange', onVisibility);
			window.removeEventListener('pagehide', flushOnLeave);
			window.removeEventListener('beforeunload', flushOnLeave);
			flushOnLeave();
		};
	}, [dashboard, trackPageDuration, pathname]);

	useEffect(() => {
		if (dashboard) return;

		const thresholds = new Set<number>();
		let scrollTimer: number | undefined;

		function measureScrollDepth() {
			const el = document.documentElement;
			const scrollHeight = Math.max(
				el.scrollHeight,
				document.body?.scrollHeight ?? 0,
				1
			);
			const scrollTop = window.scrollY || el.scrollTop;
			const viewH = window.innerHeight;
			const scrollPercent = ((scrollTop + viewH) / scrollHeight) * 100;
			for (const t of [25, 50, 75, 100] as const) {
				if (scrollPercent >= t && !thresholds.has(t)) {
					thresholds.add(t);
					trackScrollDepth(t);
				}
			}
		}

		function debouncedMeasure() {
			if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
			scrollTimer = window.setTimeout(() => measureScrollDepth(), 200);
		}

		measureScrollDepth();
		window.addEventListener('scroll', debouncedMeasure, { passive: true });

		return () => {
			window.removeEventListener('scroll', debouncedMeasure);
			if (scrollTimer !== undefined) window.clearTimeout(scrollTimer);
			thresholds.clear();
		};
	}, [dashboard, pathname, trackScrollDepth]);

	useEffect(() => {
		if (dashboard) return;

		function handleClick(ev: MouseEvent) {
			const target = clickTargetElement(ev);
			if (!target) return;

			if (target.closest('[data-track-ignore]')) return;

			const projEl = target.closest('[data-track-project]');
			if (projEl) {
				const name =
					projEl.getAttribute('data-track-project')?.trim() ?? '';
				if (name) {
					const projectId =
						projEl.getAttribute('data-project-id')?.trim() ?? undefined;
					let href: string | undefined;
					if (projEl instanceof HTMLAnchorElement) href = projEl.href;
					if (!isDisabledControl(projEl))
						trackProjectClick(name, projectId, href);
					return;
				}
				/* Empty name: treat as a normal link/control below */
			}

			const trackEl = target.closest('[data-track]');
			if (trackEl && !isDisabledControl(trackEl)) {
				const explicit = trackEl.getAttribute('data-track')?.trim();
				const label =
					explicit ||
					`Custom: ${deriveInteractiveLabel(trackEl)}`;
				let href: string | undefined;
				if (trackEl instanceof HTMLAnchorElement && trackEl.href)
					href = trackEl.href;
				trackClick(label, href ? { href } : undefined);
				return;
			}

			const linkEl = target.closest(LINK_SELECTOR);
			if (linkEl && !isDisabledControl(linkEl)) {
				let hrefFull = '';
				if (linkEl instanceof HTMLAnchorElement) hrefFull = linkEl.href;
				else if (linkEl instanceof HTMLAreaElement && linkEl.href)
					hrefFull = linkEl.href;

				const label = deriveInteractiveLabel(linkEl);
				trackClick(`Link: ${label}`, {
					href: hrefFull || undefined,
				});
				return;
			}

			const btnEl = target.closest(BUTTON_SELECTOR);
			if (btnEl && !isDisabledControl(btnEl)) {
				const label = deriveInteractiveLabel(btnEl);
				const form =
					btnEl instanceof HTMLInputElement ||
					btnEl instanceof HTMLButtonElement
						? btnEl.form
						: null;
				const formAct = form?.getAttribute('action')?.trim();
				trackClick(
					`Button: ${label}`,
					formAct ? { formAction: formAct } : undefined
				);
				return;
			}

			const labelWrap = target.closest('label');
			if (labelWrap instanceof HTMLLabelElement) {
				const ctrl = labelWrap.control;
				if (
					ctrl instanceof HTMLButtonElement ||
					ctrl instanceof HTMLInputElement
				) {
					const typ =
						ctrl instanceof HTMLInputElement
							? ctrl.type.toLowerCase()
							: 'button';
					if (
						['button', 'submit', 'reset', 'image'].includes(typ) ||
						ctrl instanceof HTMLButtonElement
					) {
						if (!isDisabledControl(ctrl)) {
							const bLabel = deriveInteractiveLabel(ctrl);
							trackClick(
								`Button: ${bLabel}`,
								labelWrap.htmlFor
									? { via: 'label', htmlFor: labelWrap.htmlFor }
									: { via: 'label' }
							);
						}
						return;
					}
				}
			}
		}

		document.addEventListener('click', handleClick, true);
		return () => document.removeEventListener('click', handleClick, true);
	}, [dashboard, pathname, trackClick, trackProjectClick]);

	useEffect(() => {
		if (dashboard || typeof IntersectionObserver === 'undefined') return;

		const enteredAt = new Map<Element, number>();
		let ioInstance: IntersectionObserver | undefined;

		function disconnectIo() {
			ioInstance?.disconnect();
		}

		function observeSections() {
			disconnectIo();
			const sections =
				document.querySelectorAll('[data-section]');
			const io = new IntersectionObserver(
				(entries) => {
					for (const entry of entries) {
						const id =
							entry.target.getAttribute('data-section')?.trim() ?? '';
						if (!id) continue;
						if (entry.isIntersecting) {
							enteredAt.set(entry.target, Date.now());
						} else {
							const start = enteredAt.get(entry.target);
							enteredAt.delete(entry.target);
							if (start != null) {
								const dur = (Date.now() - start) / 1000;
								if (dur >= 2) {
									trackSectionView(id, dur);
								}
							}
						}
					}
				},
				{ threshold: 0.5 }
			);
			ioInstance = io;
			Array.from(sections).forEach((el) => {
				io.observe(el);
			});
		}

		const t = window.setTimeout(observeSections, 0);

		return () => {
			window.clearTimeout(t);
			for (const el of Array.from(enteredAt.keys())) {
				const start = enteredAt.get(el);
				enteredAt.delete(el);
				if (start != null) {
					const dur = (Date.now() - start) / 1000;
					const id = el.getAttribute('data-section')?.trim();
					if (id && dur >= 2) {
						trackSectionView(id, dur);
					}
				}
			}
			disconnectIo();
		};
	}, [dashboard, pathname, trackSectionView]);

	return null;
}
