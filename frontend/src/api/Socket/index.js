import { SOCKET_URL } from "../../config/Settings"
import { ACCESS_STORAGE_KEY, getToken } from "../../context/utils";
import { useCallback, useEffect, useRef } from 'react';

const WEBSOCKET_URL = SOCKET_URL + "/livestatus"

const useWebSocket = () => {
    const wsRef = useRef<WebSocket | null>(null);

    const connectWebsocket = useCallback((sub_id, callback = console.log) => {
        // Close existing WebSocket before creating a new one
        if (wsRef.current) {
            wsRef.current.close();
        }

        try {
            console.log("trying to connect websocket");
            const newWs = new WebSocket(WEBSOCKET_URL + '/' + sub_id);

            // Assigning the event handlers
            newWs.onopen = () => {
                console.log("websocket connected");
                newWs.send(getToken(ACCESS_STORAGE_KEY));
            };
            
            newWs.onmessage = (event) => {
                callback(event); // Call the callback with the received event
            };
            
            newWs.onclose = (event) => {
                callback({ type: 'close', data: event });
                console.log("websocket closed", event);
            };
            
            newWs.onerror = (event) => {
                console.error("websocket error", event);
            };

            // Store the WebSocket instance in the ref
            wsRef.current = newWs;

        } catch (err) {
            console.error("Error in connecting websocket", err);
        }
        
        // Return a cleanup function
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []); // Empty dependency array means this callback never re-creates unless the component unmounts

    // Perform cleanup when the component using this hook unmounts
    useEffect(() => {
        return () => {
            if (wsRef.current) {
                wsRef.current.close();
                wsRef.current = null;
            }
        };
    }, []); // Empty dependency array means this effect runs once when the component mounts, and cleanup runs when it unmounts
    
    return { connectWebsocket };
};

export default useWebSocket;
