import * as dotenv from "dotenv";
dotenv.config();
import { AppDataSource } from "./Config/dataSource";
import express, { Request, Response }from  "express";
import bodyParser from "body-parser";
 
const app = express()

app.use(express.json())
app.use(bodyParser.json())



async function startServer(){

    AppDataSource.initialize()
    .then(()=>{
        console.log(`server connection successfull in ${process.env.POSTGRES_PORT}`)

        app.listen(process.env.PORT, ()=>{
            console.log(`Server running on port ${process.env.PORT}`)
        })
    })
    .catch((err)=>{
        console.error("error connecting to postgres DB", err)
    })
 
}


startServer()

