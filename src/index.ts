import { WebSocket, WebSocketServer } from "ws";

const wss = new WebSocketServer({port: 8080})
interface User {
    socket: WebSocket,
    room: string
}
let allSockets: User[] = [];
let userCount = 0;

wss.on("connection", function(socket) {
  

    console.log("user connected #"+userCount);
    
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message as unknown as string)
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            })
        } 
        if (parsedMessage.type === "chat") {
            console.log("User wants to chat");
            const currentUserRoom = allSockets.find((x) => x.socket == socket)?.room

            for (let i=0; i<allSockets.length; i++) {
                if (allSockets[i].room === currentUserRoom) {
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
            
        }
    })
    socket.on("disconnect", (socket) => {
        allSockets = allSockets.filter(x => x!=socket)
    })
})
