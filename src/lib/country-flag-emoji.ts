/** Basic regional-indicator pair for ISO3166-alpha2 code. */
export function countryCodeToFlagEmoji(code?: string): string {
	if (!code) return '🏳️';
	const trimmed = code.trim().toUpperCase();
	if (!/^[A-Z]{2}$/.test(trimmed)) return '🏳️';
	const first = trimmed.codePointAt(0)! - 65 + 0x1f1e6;
	const second = trimmed.codePointAt(1)! - 65 + 0x1f1e6;
	return String.fromCodePoint(first, second);
}
