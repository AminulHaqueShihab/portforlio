/** Only http(s) origins — avoids junk / `javascript:` in analytics fields rendered as links. */
export function safeHttpReferrer(raw: unknown, maxLen = 2048): string {
	if (typeof raw !== 'string') return '';
	const trimmed = raw.trim().slice(0, maxLen);
	if (!trimmed) return '';
	try {
		const u = new URL(trimmed);
		if (u.protocol !== 'http:' && u.protocol !== 'https:') return '';
		return u.href.slice(0, maxLen);
	} catch {
		return '';
	}
}
