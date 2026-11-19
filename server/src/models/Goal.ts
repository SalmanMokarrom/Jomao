//import dependencies
import mongoose, {Types, Schema} from "mongoose";

// Typescipt interfaces
interface IGoal {
    user: Types.ObjectId,
    title: string,
    targetAmount: number,
    durationMonths: 3 | 6| 9| 12,
    maturityDate: Date,
    status: "active" | "complete" | "withdrawn",
    currentAmount: number,
    transactions?: unknown[]
}


// create schema
const goalSchema = new mongoose.Schema <IGoal>({
    user:{type:Schema.Types.ObjectId, required: true, ref:"User", index:true},
    title: {type:String, required: true},
    targetAmount: {type:Number, required:true, min:1},
    durationMonths:{type: Number, required: true, enum:[3, 6, 9, 12]},
    maturityDate:{type:Date, required:true},
    status:{type: String, required:true, enum:["active","complete", "withdrawn"], default:"active"},
    currentAmount: {type:Number, default:0, min:0, required:true}
    
    

},{timestamps:true,toJSON: { virtuals: true }, 
    toObject: { virtuals: true }})

goalSchema.virtual("transactions", {
  ref: "Transaction",
  localField: "_id",
  foreignField: "goal",
});

const Goal = mongoose.model <IGoal>("Goal", goalSchema)

export default Goal