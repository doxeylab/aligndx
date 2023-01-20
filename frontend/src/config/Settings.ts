export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL

export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_ACCESS_URL
export const COMPANION_URL = process.env.NEXT_PUBLIC_COMPANION_URL
export const TUS_ENDPOINT = process.env.NEXT_PUBLIC_TUS_ENDPOINT

function socketMapper(url: string) {
    let socket_url = ""

    if (url.includes("https://")) {
        socket_url = BACKEND_URL?.replace(/https/, "wss") || ""
    }
    else {
        socket_url = BACKEND_URL?.replace(/http/, "ws") || ""
    }
    return socket_url
}

export const SOCKET_URL = socketMapper(BACKEND_URL || "")