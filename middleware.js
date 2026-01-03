import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname

    // Define paths that require authentication
    const isProtectedPath = path.startsWith('/admin')
    const isLoginPath = path === '/admin/login'

    // Get the session cookie
    const sessionToken = request.cookies.get('admin_session')?.value

    // 1. Redirect unauthenticated users to login page when accessing protected admin routes
    if (isProtectedPath && !isLoginPath && !sessionToken) {
        const response = NextResponse.redirect(new URL('/admin/login', request.url))
        return response
    }

    // 2. Redirect authenticated users to dashboard if they try to access login page
    if (isLoginPath && sessionToken) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
