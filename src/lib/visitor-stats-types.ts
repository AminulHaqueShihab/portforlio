export type VisitorStatsPayload = {
	totalVisitorRecords: number;
	totalVisits: number;
	uniqueIpCount: number;
	topCountry: { code: string; name: string; visits: number } | null;
	topDeviceType: { type: string; visits: number } | null;
	topBrowser: { browser: string; visits: number } | null;
};
