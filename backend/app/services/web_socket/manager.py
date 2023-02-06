from fastapi import WebSocket
from typing import Dict
from uuid import UUID

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str,WebSocket] = {}

    async def connect(self, id: UUID, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.update({id: websocket})

    def disconnect(self, id: UUID):
        self.active_connections.pop(id)

    async def send_data(self, data: dict, id: UUID):
        await self.active_connections[id].send_json(data)

    async def send_message(self, message: str, id: UUID):
        await self.active_connections[id].send_text(message)

    async def broadcast(self, message: str):
        for connection in self.active_connections.values():
            await connection.send_text(message)