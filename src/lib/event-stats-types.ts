export type EventStatsPayload = {
	topProjects: { label: string; count: number }[];
	topSections: { label: string; avgDuration: number }[];
	avgPageDuration: number;
	scrollDepthDistribution: {
		25: number;
		50: number;
		75: number;
		100: number;
	};
	/** Visitor count (distinct device/session) reaching at least each depth */
	scrollDepthReachedCounts: {
		25: number;
		50: number;
		75: number;
		100: number;
	};
	clicksByLabel: { label: string; count: number }[];
	eventsByType: { type: string; count: number }[];
};
