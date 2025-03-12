import { z } from "zod";

export const transactionSchema = z.object({
    type: z.enum(["INCOME", "EXPENSE"]),
    amount: z.string().min(1, { message: "amount is required" }),
    description: z.string().optional(),
    date: z.date({ required_error: "date is required" }),
    accountId: z.string().min(1, { message: "account is required" }),
    category: z.string().min(1, { message: "catgeory is required" }),
    isRecurring: z.boolean().default(false),
    recurringInterval: z.enum(["DAILY", "WEEKLY", "MONTLY", "YEARlY"]).optional()
}).superRefine((data, ctx) => {
    if (data.isRecurring && !data.recurringInterval) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Recurring interval is required for recurring transactions",
            path: ["recurringInterval"]
        });
    }
})

type userTransactionsModel = z.infer<typeof transactionSchema>;

export default userTransactionsModel;
