export type VisitorStatsPayload = {
	totalVisitorRecords: number;
	totalVisits: number;
	/** Distinct visitors: device UUID when stored, else IP (legacy rows). */
	uniqueVisitors: number;
	topCountry: { code: string; name: string; visits: number } | null;
	topDeviceType: { type: string; visits: number } | null;
	topBrowser: { browser: string; visits: number } | null;
};
