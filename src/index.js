import dotenv from "dotenv"
import connectDB from "./db/db_index.js";

dotenv.config({
    path: './.env'
})

connectDB()