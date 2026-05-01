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
		void fetch('/api/info', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({
				path: pathname,
				...(visitorDeviceId ? { visitorDeviceId } : {}),
			}),
			keepalive: true,
		}).catch(() => null);
	}, [pathname]);

	return null;
}
