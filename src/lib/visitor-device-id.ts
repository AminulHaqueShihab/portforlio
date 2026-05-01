export const VISITOR_DEVICE_STORAGE_KEY = 'portfolio_visitor_device_id';

const UUID_REGEX =
	/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function sanitizeVisitorDeviceId(raw: unknown): string | undefined {
	if (typeof raw !== 'string') return undefined;
	const s = raw.trim().toLowerCase();
	if (!UUID_REGEX.test(s)) return undefined;
	return s;
}

export function readOrCreateVisitorDeviceId(): string | undefined {
	if (typeof window === 'undefined') return undefined;
	try {
		const prev = sanitizeVisitorDeviceId(
			window.localStorage.getItem(VISITOR_DEVICE_STORAGE_KEY)
		);
		if (prev) return prev;
		const id = crypto.randomUUID().toLowerCase();
		window.localStorage.setItem(VISITOR_DEVICE_STORAGE_KEY, id);
		return id;
	} catch {
		return undefined;
	}
}
