import z from "zod";
import mongoose from "mongoose";

export const mongoIdSchema = z
  .string()
  .refine(
    (id) => mongoose.isValidObjectId(id),
    "Invalid MongoDB ID"
  );