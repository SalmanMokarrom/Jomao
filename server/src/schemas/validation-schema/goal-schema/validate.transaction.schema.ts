/* 
Project Name: Jomao 1.0.0
Description: Deposit money validation
Author: Salman Mokarrom
Date: 9 - 11 - 2026 - Library of ITU
*/


import z from "zod";
 const depositSchema = z.strictObject({
    amount: z.number()
             .int()
             .positive("Deposit amount must be a positive number"),
   idempotencyKey: z.string()
                    .trim()
                    .min(6,"the key should be at least 6 word")
})

export default depositSchema