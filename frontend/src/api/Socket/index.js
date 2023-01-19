import { BACKEND_URL } from "../../config/Settings"
import { useAuthContext } from "../../context/AuthProvider"

const base_ws_url = "ws"
const socket_url = BACKEND_URL + "livestatus"
const WEBSOCKET_URL = socket_url.replace(/http/, base_ws_url)

const useWebSocket = () => {
    const context = useAuthContext()
    
    const connectWebsocket = async (sub_id, callback = console.log) => {
        try {
            console.log("trying websocket connection")

            const ws = new WebSocket(WEBSOCKET_URL + '/' + sub_id)

            ws.onerror = function (event) {
                callback(event)
            }

            ws.onopen = function (event) {
                callback(event)
                ws.send(context.auth.accessToken)
            }

            ws.onclose = function (event) {
                callback(event)
            }

            ws.onmessage = function (event) {
                callback(event)
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