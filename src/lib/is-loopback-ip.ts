/**
 * True when the address is loopback (local dev). Public visitors get a routable IP.
 */
export function isLoopbackIp(ip: string): boolean {
	const s = ip.trim().toLowerCase();
	if (!s || s === '0.0.0.0' || s === '::1' || s === 'localhost') {
		return true;
	}
	if (s.startsWith('127.')) {
		return true;
	}
	const v4mapped = /^::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i.exec(s);
	if (v4mapped?.[1]?.startsWith('127.')) {
		return true;
	}
	return false;
}
