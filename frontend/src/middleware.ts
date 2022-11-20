import { NextResponse } from "next/server";
import useLocalStorage from "./hooks/useLocalStorage";

export default function middleware(req: any) {
  // let verify = req.cookies.get("loggedin");
  // let verify = useLocalStorage('auth')
  const verify = true
  const url = req.url
  const protectedRoutes = ['/dashboard', '/analyze', '/results', '/submissions', '/settings']

  if (!verify && protectedRoutes.some(substring => url.includes(substring))) {
    return NextResponse.redirect(new URL('/signin', url))

  }

  const ignoreRoutes = ['/signin', '/signup']
  
  if (verify && ignoreRoutes.some(substring => url.includes(substring))) {
    return NextResponse.rewrite(new URL('/dashboard', url))
  }
  
  if (verify && url === "http://localhost:3000/") {
    return NextResponse.rewrite(new URL('/dashboard', url))
  }

}