import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Add paths that should be protected
const protectedRoutes = ['/dashboard', '/client']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route))
  const isHomePage = pathname === '/'

  try {
    // Get the token from the cookies
    const token = request.cookies.get('payload-token')?.value

    // If no token and trying to access protected routes, redirect to home
    if (!token && isProtectedRoute) {
      return NextResponse.redirect(new URL('/', request.url))
    }

    // If user has a token, it suggests they're authenticated
    // Handle redirections in the component for role-based access
    // This is useful for deeper integrations with Payload CMS

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)

    // If there's an error (like invalid token), clear the token and redirect to home
    if (isProtectedRoute) {
      const response = NextResponse.redirect(new URL('/', request.url))
      response.cookies.delete('payload-token')
      return response
    }

    return NextResponse.next()
  }
}

export const config = {
  // Apply this middleware only to paths that need authentication or the home page
  matcher: ['/', '/dashboard/:path*', '/client/:path*'],
}
