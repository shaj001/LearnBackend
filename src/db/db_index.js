import mongoose from "mongoose";
import { DB_name } from "../constants.js";

const connectDB = async ()=>{
    try{
        const connectInstance = await mongoose.connect(`${process.env.MONGO_URL}/${DB_name}`)
        console.log(`\n MongoDB connected :) !! DB host: ${connectInstance.connection.host}`);
        // console.log(`=> server is running at ${process.env.PORT}`)

    }
    catch (error){
        console.log("MONGODB connection FAILED", error);
        process.exit(1)
        
    }
}

export default connectDB