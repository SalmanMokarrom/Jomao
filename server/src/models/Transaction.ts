/* 
Project Name: Jomao 1.0.0
Description: Transaction schema
Author: Salman Mokarrom
Date: 9 - 11 - 2026 - Library of ITU (12:42)
*/


import mongoose, {Types, Schema} from "mongoose"

interface Itransaction{
    user:Types.ObjectId,
    goal:Types.ObjectId,
    type: "deposit",
    amount: number,
    idempotencyKey: string
}

const TransactionSchema = new mongoose.Schema<Itransaction>({
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    goal:{
        type: Schema.Types.ObjectId,
        ref:"Goal",
        required:true
    },
    type:{
        type: String,
        required:true,
        enum:["deposit"]
    },
    amount:{
        type:Number,
        min:1,
        required:true
    },
    idempotencyKey:{
        type:String,
        required:true,
        trim: true
    }
},{
    timestamps:true
})


TransactionSchema.index(
  { user: 1, idempotencyKey: 1 },
  { unique: true }
);
// useful for retrieving the goal and get newest one first

TransactionSchema.index({
  goal: 1,
  createdAt: -1
});

const Transaction = mongoose.model<Itransaction>("Transaction",TransactionSchema)

export default Transaction