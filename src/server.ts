import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./Config/dataSource";
import express from  "express";
import bodyParser from "body-parser";
import paymentRoutes from "./Routes/paymentRoutes"
import http from "http";
import { Server } from "socket.io";

const app = express()

app.use(express.json())
app.use(bodyParser.json())

app.set("query parser", "extended");

app.use("/api/dashboard/payments", paymentRoutes)

const server = http.createServer(app);


export const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket)=>{
  console.log("Client connected:", socket.id);

  socket.on("disconnect", ()=>{
    console.log("Client disconnected:", socket.id);
  });
});


async function startServer(){

    AppDataSource.initialize()
    .then(()=>{
        console.log(`server connection successfull in ${process.env.POSTGRES_PORT}`)

        server.listen(process.env.PORT, ()=>{
            console.log(`Server running on port ${process.env.PORT}`)
        })
    })
    .catch((err)=>{
        console.error("error connecting to postgres DB", err)
    })
 
}


startServer()

