import { requestHasAdminCookie } from '@/lib/admin-auth';
import connectDB from '@/lib/mongodb';
import Visitor from '@/lib/models/Visitor';
import mongoose from 'mongoose';
import { type NextRequest, NextResponse } from 'next/server';

export async function DELETE(
	request: NextRequest,
	{ params }: { params: { id: string } }
) {
	if (!(await requestHasAdminCookie(request))) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	const { id } = params;
	if (!id || !mongoose.Types.ObjectId.isValid(id)) {
		return NextResponse.json({ error: 'Invalid visitor id' }, { status: 400 });
	}

	await connectDB();
	const res = await Visitor.deleteOne({
		_id: new mongoose.Types.ObjectId(id),
	});

	if (res.deletedCount === 0) {
		return NextResponse.json({ error: 'Not found' }, { status: 404 });
	}

	return NextResponse.json({ ok: true });
}
