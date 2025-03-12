"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// Define types
type AccountData = {
    name: string;
    balance: string | number;
    isDefault?: boolean;
};

// Serialize transaction helper function
const serializeTransaction = (obj: any) => {

    const serialzied = { ...obj }

    if (obj.balance) {
        serialzied.balance = obj.balance.toNumber()
    }

    if (obj.amount) {
        serialzied.amount = obj.amount.toNumber()
    }

    return serialzied
};

// Create account function
export const createAccount = async (data: AccountData): Promise<{ success: boolean; data?: any; error?: string }> => {
    try {
        const authData = await auth();
        if (!authData || !authData.userId) throw new Error("Unauthorized");

        const user = await db.user.findUnique({
            where: { clerkUserId: authData.userId },
        });

        if (!user) {
            throw new Error("User not found");
        }

        // Convert balance to float safely
        const balanceFloat = parseFloat(String(data.balance));

        if (isNaN(balanceFloat)) {
            throw new Error("Invalid balance amount");
        }

        // Check if this is the user's first account
        const existingAccounts = await db.account.findMany({
            where: { userId: user.id },
        });

        const shouldBeDefault = existingAccounts.length === 0 ? true : data.isDefault ?? false;

        // If this account should be default, unset other default accounts
        if (shouldBeDefault) {
            await db.account.updateMany({
                where: { userId: user.id, isDefault: true },
                data: { isDefault: false },
            });
        }

        // Create the new account
        const account = await db.account.create({
            data: {
                ...data,
                balance: balanceFloat,
                userId: user.id,
                isDefault: shouldBeDefault,
            },
        });

        // Serialize & return the account
        const serializedAccount = serializeTransaction(account);
        revalidatePath("/dashboard");

        return { success: true, data: serializedAccount };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
};

export const getuserAccounts = async () => {

    const { userId } = await auth()

    if (!userId) throw new Error("Unauthorized")

    const user = await db.user.findUnique({
        where: { clerkUserId: userId }
    })

    if (!user) {
        throw new Error("User not found")
    }

    const accounts = await db.account.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
        include: {
            _count: {
                select: {
                    transactions: true
                }
            }
        }
    })

    const serializedAccount = accounts.map(serializeTransaction);

    return serializedAccount

}

export async function getDashboardData() {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");
  
    const user = await db.user.findUnique({
      where: { clerkUserId: userId },
    });
  
    if (!user) {
      throw new Error("User not found");
    }
  
    // Get all user transactions
    const transactions = await db.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: "desc" },
    });
  
    return transactions.map(serializeTransaction);
  }