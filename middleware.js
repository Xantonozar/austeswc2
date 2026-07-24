import { NextResponse } from 'next/server';

function decodeJwt(token) {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
        if (payload.exp && payload.exp * 1000 < Date.now()) return null;
        return payload;
    } catch {
        return null;
    }
}

export function middleware(request) {
    const path = request.nextUrl.pathname;

    const isAdminProtectedPath = path.startsWith('/admin');
    const isAdminLoginPath = path === '/admin/login';
    const adminSession = request.cookies.get('admin_session')?.value;

    if (isAdminProtectedPath && !isAdminLoginPath && !adminSession) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    if (isAdminLoginPath && adminSession) {
        const payload = decodeJwt(adminSession);
        if (payload) {
            return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        }
        const response = NextResponse.next();
        response.cookies.delete('admin_session');
        return response;
    }

    if (isAdminProtectedPath && !isAdminLoginPath && adminSession) {
        const payload = decodeJwt(adminSession);
        if (payload) {
            const requestHeaders = new Headers(request.headers);
            requestHeaders.set('x-admin-id', payload.id);
            requestHeaders.set('x-admin-role', payload.role);
            requestHeaders.set('x-admin-name', payload.name);
            requestHeaders.set('x-admin-username', payload.username);
            const response = NextResponse.next({ request: { headers: requestHeaders } });
            return response;
        }
        const response = NextResponse.redirect(new URL('/admin/login', request.url));
        response.cookies.delete('admin_session');
        return response;
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/admin/:path*'],
};
