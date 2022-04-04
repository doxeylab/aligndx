import { URL } from "../../config/Settings"

const base_ws_url = "ws"
const socket_url = URL + "livegraphs"
const WEBSOCKET_URL = socket_url.replace(/http/, base_ws_url)

export const connectWebsocket = (file_id, token, callback) => {
    try {
        console.log("trying websocket connection")
        const ws = new WebSocket(WEBSOCKET_URL + '/' + file_id) 
        
        ws.onerror = function (event) {
            console.log(event)
        }

        ws.onopen = function (event) {
            console.log("socket opened")
            ws.send(token) 
        }
        
        ws.onclose = function (event) {
            console.log("socket closed")
            console.log(event)
        }

        ws.onmessage = function (event) {
            const obj = JSON.parse(event.data)
            if (obj.status == "complete"){
                console.log(`Transaction status is ${obj.status}`)
                callback(event.data, event.data.sample, event.data.pathogens)
                ws.close();
            }
            if (obj.status == "pending"){
                console.log(`Transaction status is ${obj.status}`)  
            }

            if (obj.status == "ready"){
                console.log(`Transaction status is ${obj.status}`)  
                // console.log(event.data)
                callback(event.data, event.data.sample, event.data.pathogens)
            } 
        }
    }

    catch (err) {
        console.error(err);
    }
};