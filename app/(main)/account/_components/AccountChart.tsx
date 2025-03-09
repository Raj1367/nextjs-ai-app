"use client";
import { endOfDay, startOfDay, subDays, format } from "date-fns";
import React, { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { object } from "zod";

type TransactionData = {
  date: string;
  income: number;
  expense: number;
};

const DATE_RANGES = {
  WEEKLY: { label: "Last 7 days", days: 7 },
  MONTHLY: { label: "Last Month", days: 30 },
  QUARTERLY: { label: "Last 3 Months", days: 90 },
  SEMIANNUAL: { label: "Last 6 Months", days: 180 },
  ALL: { label: "All Time", days: null },
};

type transactionsProps = {
  transactions: TransactionsAllTypes[];
};

export interface TransactionsAllTypes {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  date: string;
  category: string;
  receiptUrl?: string;
  isRecurring: boolean;
  recurringInterval: RecurringInterval;
  nextRecurringDate?: Date;
  lastProcessed?: Date;
  status: TransactionStatus;
}

export enum TransactionType {
  INCOME = "INCOME",
  EXPENSE = "EXPENSE",
}

export enum RecurringInterval {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  YEARLY = "YEARLY",
}

export enum TransactionStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

const AccountChart: React.FC<transactionsProps> = ({ transactions }) => {
  const [dateRange, setDateRange] = useState("MONTHLY");

  // console.log(transactions)

  const filteredData = useMemo(() => {
    const range = DATE_RANGES[dateRange];

    // console.log("range", range)

    const now = new Date();
    // subtarcts defined range.days from today.date to get the starting date
    // startOfDay(...): Ensures the start time is 00:00:00 for accurate comparisons.
    // If range.days is null (for "ALL"), the start date is new Date(0)
    // (which represents January 1, 1970, effectively including all transactions).
    const startDate = range.days
      ? startOfDay(subDays(now, range.days))
      : startOfDay(new Date(0));
    // console.log("startDate", startDate)

    // new Date(t.date): Converts the transaction’s date string into a Date object.
    // >= startDate: Ensures the transaction is within the desired range.
    // <= endOfDay(now): Ensures the transaction is counted until the end of the current day.
    const filtered = transactions.filter(
      (t) => new Date(t.date) >= startDate && new Date(t.date) <= endOfDay(now)
    );
    // console.log("filtered",filtered)

    // reduce function:
    // It iterates over each transaction in filtered.
    // The accumulator acc is an object where each key is a formatted date string (e.g., "Mar 09").
    // Extracting Date:
    // format(new Date(curr.date), "MMM dd") converts the transaction date to a readable format like "Mar 09", "Feb 28", etc.
    // Checking if Date Already Exists in acc:
    // If the date key doesn’t exist in acc, it initializes it with { date, income: 0, expense: 0 }.
    // Updating Income or Expense:
    // If the transaction type is INCOME, its amount is added to income.
    // Otherwise, the amount is added to expense
    const grouped = filtered.reduce<Record<string, TransactionData>>(
      (acc, curr) => {
        const date = format(new Date(curr.date), "MMM dd");

        if (!acc[date]) {
          acc[date] = { date, income: 0, expense: 0 };
        }

        if (curr.type === TransactionType.INCOME) {
          acc[date].income += curr.amount;
        } else {
          acc[date].expense += curr.amount;
        }

        return acc;
      },
      {}
    );

    // console.log("grouped", grouped);

    // Convert to array and sort by date
    return Object.values(grouped).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [transactions, dateRange]);

  console.log(filteredData);

  const totals = useMemo(() => {
    return filteredData.reduce(
      (acc, curr) => ({
        income: acc.income + curr.income,
        expense: acc.expense + curr.expense,
      }),
      { income: 0, expense: 0 }
    );
  }, [filteredData]);

  // console.log("total", totals);

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center space-y-0 pb-7">
        <CardTitle className="text-base font-semibold">Transactions Overview</CardTitle>
        <Select defaultValue={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="select range" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(DATE_RANGES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row justify-around mb-6 text-sm">

          <div className="text-center">
            <p className="text-muted-foreground">Total Income</p>
            <p className="text-lg font-bold text-green-500">
              ${totals.income.toFixed(2)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">Total Expenses</p>
            <p className="text-lg font-bold text-red-500">
              ${totals.income.toFixed(2)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-muted-foreground">Net</p>
            <p className={`text-lg font-bold ${totals.income - totals.expense >= 0 ? "text-green-500" : "text-red-500"}`}>
              ${(totals.income - totals.expense).toFixed(2)}
            </p>
          </div>

        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={filteredData}
            margin={{
              top: 10,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value)=>`${value}`} fontSize={12} tickLine={false} axisLine={false} />
            <Tooltip formatter={(value)=>[`${value}`,undefined]} />
            <Legend />
            <Bar
              dataKey="income"
              fill="#22c55e"
              activeBar={<Rectangle fill="gold" stroke="purple" />}
              radius={[4,4,0,0]}
            />
            <Bar
              dataKey="expense"
              fill="#ef4444"
              activeBar={<Rectangle fill="pink" stroke="blue" />}
              radius={[4,4,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default AccountChart;
