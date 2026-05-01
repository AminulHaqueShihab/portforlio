'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

export default function VisitorTracker() {
	const pathname = usePathname();

	useEffect(() => {
		if (pathname.startsWith('/dashboard')) {
			return;
		}

		void fetch('/api/info', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ path: pathname }),
			keepalive: true,
		}).catch(() => null);
	}, [pathname]);

	return null;
}
