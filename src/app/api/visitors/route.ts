import { requestHasAdminCookie } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import Visitor from '@/lib/models/Visitor';
import {
	parseVisitorQuery,
	searchFilter,
	type VisitorsListResponse,
	type VisitorSerializable,
	toSerializableVisitor,
} from '@/lib/visitors-query';
import { type NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
	if (!(await requestHasAdminCookie(request))) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	let page: number;
	let limit: number;
	let sortBy: ReturnType<typeof parseVisitorQuery>['sortBy'];
	let sortOrder: 'asc' | 'desc';
	let search: string | undefined;

	try {
		const q = parseVisitorQuery(request);
		page = q.page;
		limit = q.limit;
		sortBy = q.sortBy;
		sortOrder = q.sortOrder;
		search = q.search;
	} catch {
		return NextResponse.json({ error: 'Bad query' }, { status: 400 });
	}

	const sortMongo: Record<string, 1 | -1> = {
		[sortBy]: sortOrder === 'asc' ? 1 : -1,
		_id: -1,
	};

	await connectDB();

	const filter =
		search && search.length > 0 ? searchFilter(search) : {};

	const skip = (page - 1) * limit;

	const [rows, total] = await Promise.all([
		Visitor.find(filter).sort(sortMongo).skip(skip).limit(limit).lean().exec(),
		Visitor.countDocuments(filter),
	]);

	const visitors: VisitorSerializable[] = rows.map(toSerializableVisitor);
	const totalPages = Math.max(1, Math.ceil(total / limit));

	const body: VisitorsListResponse = {
		visitors,
		total,
		page,
		limit,
		totalPages,
		sortBy,
		sortOrder,
		search: search ?? '',
	};

	return NextResponse.json(body);
}

export async function DELETE(request: NextRequest) {
	if (!(await requestHasAdminCookie(request))) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	await connectDB();
	await Visitor.deleteMany({});

	return NextResponse.json({ ok: true });
}
