export const ADMIN_COOKIE_NAME = 'portfolio_admin_token';

async function digestSha256Hex(input: string): Promise<string> {
	const enc = new TextEncoder().encode(input);
	const buf = await crypto.subtle.digest('SHA-256', enc);
	const bytes = Array.from(new Uint8Array(buf));
	return bytes.map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function computeAdminCookieValue(): Promise<string> {
	const pwd = process.env.ADMIN_PASSWORD;
	if (!pwd) {
		throw new Error('ADMIN_PASSWORD is not configured');
	}
	return digestSha256Hex(`portfolio-admin-session|${pwd}`);
}

/** Edge-safe admin cookie verifier (middleware). */
export async function isValidAdminCookie(
	token: string | undefined
): Promise<boolean> {
	if (!token) return false;
	let expected: string;
	try {
		expected = await computeAdminCookieValue();
	} catch {
		return false;
	}
	return timingSafeEqualAsciiHex(token, expected);
}

/** Node API routes — same verifier. */
export async function requestHasAdminCookie(request: Request): Promise<boolean> {
	const raw = request.headers.get('cookie');
	const token = parseCookie(raw, ADMIN_COOKIE_NAME);
	return isValidAdminCookie(token);
}

function parseCookie(cookieHeader: string | null, name: string): string | undefined {
	if (!cookieHeader) return undefined;
	for (const part of cookieHeader.split(';')) {
		const trimmed = part.trim();
		const eq = trimmed.indexOf('=');
		if (eq < 0) continue;
		const k = trimmed.slice(0, eq).trim();
		const v = trimmed.slice(eq + 1).trim();
		if (k === name) {
			try {
				return decodeURIComponent(v);
			} catch {
				return v;
			}
		}
	}
	return undefined;
}

function timingSafeEqualAsciiHex(a: string, b: string): boolean {
	if (a.length !== b.length) return false;
	let out = 0;
	for (let i = 0; i < a.length; i++) {
		out |= a.charCodeAt(i) ^ b.charCodeAt(i);
	}
	return out === 0;
}
