'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { readOrCreateVisitorDeviceId } from '@/lib/visitor-device-id';

export default function VisitorTracker() {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname.startsWith('/dashboard')) {
			return;
		}

		const visitorDeviceId = readOrCreateVisitorDeviceId();
		const navigationReferrer =
			typeof document !== 'undefined' ? document.referrer : '';

		void fetch('/api/info', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				path: pathname,
				...(visitorDeviceId ? { visitorDeviceId } : {}),
				...(navigationReferrer ? { navigationReferrer } : {}),
			}),
			keepalive: true,
		}).catch(() => null);
	}, [pathname]);

	return null;
}
