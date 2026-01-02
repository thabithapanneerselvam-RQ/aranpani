//have db config of PG
import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";
dotenv.config();

export const AppDataSource = new DataSource({
    type:"postgres",
    host:"localhost",
    port:Number(process.env.POSTGRES_PORT),
    username:"postgres",
    password: "Thabitha_25",
    database: "aranpani",
    synchronize:false,
    logging:false,
    entities:[__dirname + "/../Models/*.{ts,js}"],
    migrations: [__dirname + "/../Migrations/*.{ts,js}"]
})
