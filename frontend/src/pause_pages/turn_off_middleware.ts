import { NextResponse } from 'next/server'
import { BASE_URL } from '../config/Settings'
export default function middleware(req: any) {
    // first identify if token exists
    // if it does, run verify function, to confirm that the token actually works
    // if we get a 201, that means the user is allowed to access the protected routes
    // only run this when the requested pages are private, i.e. they are in the matcher
    const verify = req.headers.get('Authorization')

    const url = req.url
    const protectedRoutes = [
        '/dashboard',
        '/analyze',
        '/results',
        '/submissions',
        '/settings',
    ]

    if (
        !verify &&
        protectedRoutes.some((substring) => url.includes(substring))
    ) {
        return NextResponse.redirect(new URL('/signin', url))
    }

    const ignoreRoutes = ['/signin', '/signup']

    if (verify && ignoreRoutes.some((substring) => url.includes(substring))) {
        return NextResponse.rewrite(new URL('/dashboard', url))
    }

    if (verify && url === BASE_URL) {
        return NextResponse.rewrite(new URL('/dashboard', url))
    }
}

export const config = {
    matcher: [
        '/dashboard',
        '/analyze',
        '/results',
        '/submissions',
        '/settings',
    ],
}
