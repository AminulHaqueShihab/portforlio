import {
	ADMIN_COOKIE_NAME,
	computeAdminCookieValue,
} from '@/lib/admin-auth';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
	let password = '';
	try {
		const body = (await request.json()) as { password?: string };
		password =
			typeof body.password === 'string' ? body.password : '';
	} catch {
		return NextResponse.json({ ok: false, error: 'Invalid body' }, { status: 400 });
	}

	const expected = process.env.ADMIN_PASSWORD;
	if (!expected) {
		return NextResponse.json(
			{ ok: false, error: 'Admin auth is not configured' },
			{ status: 500 }
		);
	}

	if (password !== expected) {
		return NextResponse.json({ ok: false, error: 'Invalid password' }, { status: 401 });
	}

	let token: string;
	try {
		token = await computeAdminCookieValue();
	} catch {
		return NextResponse.json(
			{ ok: false, error: 'Admin auth misconfigured' },
			{ status: 500 }
		);
	}

	const res = NextResponse.json({ ok: true });

	const secure = process.env.NODE_ENV === 'production';
	res.cookies.set({
		name: ADMIN_COOKIE_NAME,
		value: token,
		httpOnly: true,
		sameSite: 'lax',
		path: '/',
		secure,
		maxAge: 60 * 60 * 24 * 7,
	});

	return res;
}
