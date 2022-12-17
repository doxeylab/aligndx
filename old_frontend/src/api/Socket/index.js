import { useEffect, useState } from "react"
import { URL } from "../../config/Settings"
import { useAuthContext } from "../../context/AuthProvider"

const base_ws_url = "ws"
const socket_url = URL + "livegraphs"
const WEBSOCKET_URL = socket_url.replace(/http/, base_ws_url)

const useWebSocket = (file_id, callback) => {
    const context = useAuthContext()

    const connectWebsocket = async () => {
        try {
            console.log("trying websocket connection")
            const ws = new WebSocket(WEBSOCKET_URL + '/' + file_id)

            ws.onerror = function (event) {
                console.log("an error occured")
                console.log(event)
            }

            ws.onopen = function (event) {
                ws.send(context.auth.accessToken)
            }

            ws.onclose = function (event) {
                console.log("socket closed")
                console.log(event)
            }

            ws.onmessage = function (event) {
                const obj = JSON.parse(event.data)
                callback(obj)
            }
        }

        catch (err) {
            // Handle Error Here
            console.log("error")
            console.error(err);
        }
    };

    return { connectWebsocket }
}

export default useWebSocket;