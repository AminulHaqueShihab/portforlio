import {
	ADMIN_COOKIE_NAME,
	isValidAdminCookie,
} from '@/lib/admin-auth';
import { type NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (pathname.startsWith('/dashboard/login')) {
		return NextResponse.next();
	}

	if (!pathname.startsWith('/dashboard')) {
		return NextResponse.next();
	}

	const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;
	const ok = await isValidAdminCookie(token);

	if (!ok) {
		const url = request.nextUrl.clone();
		url.pathname = '/dashboard/login';
		url.searchParams.set('from', pathname);
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/dashboard', '/dashboard/:path*'],
};
