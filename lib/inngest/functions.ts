import sendEmail from "@/actions/sendEmail";
import { inngest } from "../../inngest/client";
import { db } from "../prisma";
import EmailTemplate from "@/emails/template";

interface Budget {
  id: string;
  userId: string;
  amount: number;
  lastAlertSent: Date | null; // Allow null in case there's no last alert sent
  user: {
    accounts: {
      id: string;
      isDefault: boolean;
    }[];
    email: string;
    name: string;
  };
}

export const checkBudget = inngest.createFunction(
  { id: "check budget Alerts" },
  { cron: "0 */6 * * *" },
  async () => {
    try {
      // Fetch all the budgets
      const budgets = await db.budget.findMany({
        include: {
          user: {
            include: {
              accounts: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      });

      // Iterate over each budget to check the conditions
      for (const budget of budgets) {
        const defaultAccount = budget.user.accounts[0];
        if (!defaultAccount) {
          continue;
        }

        const currentDate = new Date();
        const startOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth(),
          1
        );
        const endOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0,
          23,
          59,
          59,
          999 // Ensure it's the last moment of the last day of the month
        );

        // Aggregate expenses for the current month
        const expenses = await db.transaction.aggregate({
          where: {
            userId: budget.userId,
            accountId: defaultAccount.id,
            type: "EXPENSE",
            date: {
              gte: startOfMonth,
              lte: endOfMonth,
            },
          },
          _sum: {
            amount: true,
          },
        });

        const totalExpenses = expenses._sum.amount?.toNumber() || 0;
        const budgetAmount = budget.amount;
        const percentageUsed = (totalExpenses / Number(budgetAmount)) * 100;

        // Check if alert should be sent
        const lastAlertDate = budget.lastAlertSent
          ? new Date(budget.lastAlertSent)
          : null;

        if (
          percentageUsed >= 80 &&
          (!lastAlertDate || isNewMonth(lastAlertDate, currentDate))
        ) {
          // Send Email Logic
          await sendEmail({
            to: budget.user.email,
            subject: `Budget Alert for ${defaultAccount.name}`,
            react: EmailTemplate({
              userName: budget.user.name,
              type: "budget-alert",
              data: {
                percentageUsed: percentageUsed.toFixed(1), // Fixed typo and formatting
                budgetAmount: budgetAmount.toFixed(1), // Ensure proper formatting
                totalExpenses: totalExpenses.toFixed(1), // Ensure proper formatting
                accountName: defaultAccount.name,
              },
            }),
          });

          // Update LastAlertSent field after sending the alert
          await db.budget.update({
            where: { id: budget.id },
            data: { lastAlertSent: new Date() },
          });
        }
      }
    } catch (error) {
      console.error("Error in budget alert function:", error);
      // Handle error appropriately (e.g., logging or retrying)
    }
  }
);

// Helper function to check if it's a new month
const isNewMonth = (lastAlertDate: Date, currentDate: Date): boolean => {
  return (
    lastAlertDate.getMonth() !== currentDate.getMonth() ||
    lastAlertDate.getFullYear() !== currentDate.getFullYear()
  );
};
