import {WebSocketServer} from "ws";

const wsServer = new WebSocketServer({
port: 8080
})


wsServer.on("connection", function connection(ws){
    wsServer.on("message", function message(data){
        console.log("message received:", data)
    })
    ws.send("connected to server")
})

