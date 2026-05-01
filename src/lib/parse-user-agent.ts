import { UAParser } from 'ua-parser-js';

export type ParsedUa = {
	browser: string;
	os: string;
	deviceType: 'mobile' | 'tablet' | 'desktop';
};

export function parseUserAgent(ua: string | null): ParsedUa {
	const raw = ua ?? '';
	const p = new UAParser(raw);
	const browserName = p.getBrowser().name ?? 'Unknown';
	const browserVersion = p.getBrowser().version ?? '';
	const browser = browserVersion
		? `${browserName} ${browserVersion}`
		: browserName;
	const osName = p.getOS().name ?? 'Unknown';
	const osVersion = p.getOS().version ?? '';
	const os = osVersion ? `${osName} ${osVersion}` : osName;
	const t = p.getDevice().type;
	let deviceType: ParsedUa['deviceType'] = 'desktop';
	if (t === 'mobile') deviceType = 'mobile';
	else if (t === 'tablet') deviceType = 'tablet';
	return { browser, os, deviceType };
}
