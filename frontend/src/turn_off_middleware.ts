import { NextResponse } from "next/server";
import { BASE_URL } from "./config/Settings";
export default function middleware(req: any) {
    const verify = req.headers.get("Authorization");

    const url = req.url
    const protectedRoutes = ['/dashboard', '/analyze', '/results', '/submissions', '/settings']

    if (!verify && protectedRoutes.some(substring => url.includes(substring))) {
        return NextResponse.redirect(new URL('/signin', url))

    }

    const ignoreRoutes = ['/signin', '/signup']

    if (verify && ignoreRoutes.some(substring => url.includes(substring))) {
        return NextResponse.rewrite(new URL('/dashboard', url))
    }

    if (verify && url === BASE_URL) {
        return NextResponse.rewrite(new URL('/dashboard', url))
    }

}

export const config = { matcher: ['/dashboard', '/analyze','/results','/submissions','/settings'] }

