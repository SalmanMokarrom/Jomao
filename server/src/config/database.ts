import mongoose from "mongoose";
import { env } from "./env";

export async function connectDatabase(): Promise<void>{
    await mongoose.connect(env.MONGODB_URI, {
        dbName: "Jomao",
    });

    console.log("mongoDB connected successfully")
}