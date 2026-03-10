import { NextResponse } from 'next/server'

export function middleware(request) {
    const path = request.nextUrl.pathname

    // ─── Admin Dashboard Auth ───
    const isAdminProtectedPath = path.startsWith('/admin')
    const isAdminLoginPath = path === '/admin/login'
    const adminSession = request.cookies.get('admin_session')?.value

    if (isAdminProtectedPath && !isAdminLoginPath && !adminSession) {
        return NextResponse.redirect(new URL('/admin/login', request.url))
    }
    if (isAdminLoginPath && adminSession) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    }

    // ─── Panel Dashboard Auth ───
    const isPanelProtectedPath = path.startsWith('/panel')
    const isPanelLoginPath = path === '/panel/login'
    const panelSession = request.cookies.get('panel_session')?.value

    if (isPanelProtectedPath && !isPanelLoginPath && !panelSession) {
        return NextResponse.redirect(new URL('/panel/login', request.url))
    }
    if (isPanelLoginPath && panelSession) {
        return NextResponse.redirect(new URL('/panel', request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*', '/panel/:path*'],
}
