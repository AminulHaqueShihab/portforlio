import { requestHasAdminCookie } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import Visitor from '@/lib/models/Visitor';
import mongoose from 'mongoose';
import { type NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
	if (!(await requestHasAdminCookie(request))) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	let body: unknown;
	try {
		body = await request.json();
	} catch {
		return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
	}

	const parsed =
		typeof body === 'object' &&
		body !== null &&
		'ids' in body &&
		Array.isArray((body as { ids: unknown }).ids)
			? (body as { ids: string[] }).ids
			: null;

	if (!parsed || parsed.length === 0) {
		return NextResponse.json(
			{ error: 'ids must be a non-empty array of string ids' },
			{ status: 400 }
		);
	}

	const objectIds = parsed
		.filter((x): x is string => typeof x === 'string')
		.filter((id) => mongoose.Types.ObjectId.isValid(id))
		.map((id) => new mongoose.Types.ObjectId(id));

	if (!objectIds.length) {
		return NextResponse.json(
			{ error: 'No valid ObjectIds provided' },
			{ status: 400 }
		);
	}

	await connectDB();
	const result = await Visitor.deleteMany({ _id: { $in: objectIds } });

	return NextResponse.json({ ok: true, deletedCount: result.deletedCount });
}
