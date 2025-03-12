"use client";
import createTransaction from "@/actions/transaction";
import useFetch from "@/app/hooks/useFetch";
import { transactionSchema } from "@/app/Schema/TransactionSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import CreateAccountDrawer from "@/components/CreateAccountDrawer";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RecipetScanner from "./RecipetScanner";

const AddTransactionForm = ({ accounts, categories }) => {

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      type: "EXPENSE",
      amount: "",
      accountId: accounts.find((acc: any) => acc.isDefault)?.id,
      date: new Date(),
      isRecurring: false,
    },
    resolver: zodResolver(transactionSchema),
  });

  const { loading: transactionLoading, func: transactionFunc, data: transactionData, error } = useFetch(createTransaction);

  const type = watch("type");
  const isRecurring = watch("isRecurring");
  const date = watch("date");

  const filteredCategories = categories.filter(
    (category: any) => category.type === type
  );

  const onSubmit = (data) => {
    const formData = {
      ...data,
      amount: parseFloat(data.amount),
    };
    transactionFunc(formData);
  };

  useEffect(() => {
    if (transactionData?.success && !transactionLoading) {
      toast.success("Transaction created successfully");
      reset();
      router.push(`/account/${transactionData.data.accountId}`);
    }
  }, [transactionData, transactionLoading])

  useEffect(() => {
    if (error) {
      toast.error(error || "Failed to add transaction");
    }
  }, [error]);

  const handleScanComplete = (scannedData) => {

  }

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

      {/* AI RECEPT SCANNER */}
      <div>
        <RecipetScanner onScanComplete={handleScanComplete} />
      </div>

      {/* FORM */}
      <div className="space-y-2">
        <label htmlFor="type" className="text-sm font-medium px-1">
          Type
        </label>
        <Select
          defaultValue={type}
          onValueChange={(value: "INCOME" | "EXPENSE") =>
            setValue("type", value)
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EXPENSE">Expense</SelectItem>
            <SelectItem value="INCOME">Income</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && (
          <span className="text-red-500 text-xs px-1">
            {errors.type.message}
          </span>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 w-full">
          <label htmlFor="amount" className="text-sm font-medium px-1">
            Amount
          </label>
          <Input
            className="w-full"
            type="number"
            step="0.01"
            placeholder="0.00"
            {...register("amount")}
          />
          {errors.amount && (
            <span className="text-red-500 text-xs px-1">
              {errors.amount.message}
            </span>
          )}
        </div>

        <div className="space-y-2 w-full">
          <label htmlFor="account" className="text-sm font-medium px-1">
            Account
          </label>
          <Select
            defaultValue={getValues("accountId")}
            onValueChange={(value) => setValue("accountId", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="select type" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  {account.name} (${parseFloat(account.balance).toFixed(2)})
                </SelectItem>
              ))}
              <CreateAccountDrawer>
                <Button
                  variant="ghost"
                  className="font-semibold w-full select-none items-center"
                >
                  create Account
                </Button>
              </CreateAccountDrawer>
            </SelectContent>
          </Select>
          {errors.amount && (
            <span className="text-red-500 text-xs px-1">
              {errors.amount.message}
            </span>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium px-1">
          Category
        </label>
        <Select
          onValueChange={(value) => setValue("category", value)}
          defaultValue={getValues("category")}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="select category" />
          </SelectTrigger>
          <SelectContent>
            {filteredCategories.map((category) => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.category && (
          <span className="text-red-500 text-xs px-1">
            {errors.category.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <label htmlFor="category" className="text-sm font-medium px-1">
          Date
        </label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full pl-3 text-left font-normal"
            >
              {date ? format(date, "PPP") : <span>Pick a date</span>}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => setValue("date", date)}
              disabled={(date: Date) =>
                date > new Date() || date < new Date("1900-01-01")
              }
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {errors.date && (
          <span className="text-red-500 text-xs px-1">
            {errors.date.message}
          </span>
        )}
      </div>

      <div className="space-y-2 w-full">
        <label htmlFor="description" className="text-sm font-medium px-1">
          Description
        </label>
        <Input
          className="w-full"
          type="text"
          placeholder="Enter description"
          {...register("description")}
        />
        {errors.description && (
          <span className="text-red-500 text-xs px-1">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-1 justify-between rounded-lg border p-3">
        <div className="w-full flex justify-between">
          <label htmlFor="isDefault" className="text-sm font-medium">
            Recurring Transaction
          </label>
          <Switch
            id="isDefault"
            checked={isRecurring}
            onCheckedChange={(checked) => setValue("isRecurring", checked)}
          />
        </div>
        <span className="text-xs text-orange-500 font-medium">
          setup a recurring schedule for this transaction
        </span>
      </div>

      <div>
        {isRecurring && (
          <div className="space-y-2">
            <label htmlFor="category" className="text-sm font-medium px-1">
              Recurring interval
            </label>
            <Select
              onValueChange={(value) => setValue("recurringInterval", value)}
              defaultValue={getValues("recurringInterval")}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="select interval" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="DAILY">Daily</SelectItem>
                <SelectItem value="WEEKLY">Weekly</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>
            {errors.recurringInterval && (
              <span className="text-red-500 text-xs px-1">
                {errors.recurringInterval.message}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-5 items-center justify-center mt-4">

        <Button type="submit" className="w-full" disabled={transactionLoading}>create Transaction</Button>
        <Button
          onClick={() => router.back()}
          type="button"
          variant="outline"
          className="w-full"
        >
          cancel
        </Button>
      </div>

    </form>
  );
};

export default AddTransactionForm;
