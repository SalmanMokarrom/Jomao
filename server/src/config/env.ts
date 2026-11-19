import "dotenv/config"
import {z} from "zod"

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    MONGODB_URI: z.string().min(1, "MONGODB_URI is required"),
    JWT_SECRET: z.string().min(12, "JWT_SECRET must be at least 32 characters" )

})

export const env = envSchema.parse(process.env)
 