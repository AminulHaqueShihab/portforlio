export type EventListItem = {
	id: string;
	type: string;
	label: string;
	path: string;
	value: number | null;
	timestamp: string;
	sessionId: string;
	visitorDeviceId: string;
	visitor: {
		ip: string;
		country: string;
		browser: string;
		deviceType: string;
	} | null;
};

export type EventsListResponse = {
	events: EventListItem[];
	total: number;
	page: number;
	limit: number;
	totalPages: number;
};
