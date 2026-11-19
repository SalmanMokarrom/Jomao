import app from "./app"
import { connectDatabase } from "./config/database"
import { env } from "./config/env"


async function startServer():Promise <void>{

    try{
        await connectDatabase();

        app.listen(env.PORT,()=>{
        console.log(`Jomao API running on ${env.PORT}`)
        })
        
    } catch(error){
        console.error("Failed To Start Jomao API", error)
        process.exit(1)
    } 

}

void startServer();

