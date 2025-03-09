"use client";
import React, { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userAccountsModel, { accountsSchema } from "@/app/Schema/AccountSchema";
import { Input } from "./ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Switch } from "./ui/switch";
import { Button } from "./ui/button";
import useFetch from "@/app/hooks/useFetch";
import { createAccount } from "@/actions/dashboard";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface childrenProps {
    children: React.ReactNode;
}

const CreateAccountDrawer: FC<childrenProps> = ({ children }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors },
    } = useForm<userAccountsModel>({
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: "",
            isDefault: false,
        },
        resolver: zodResolver(accountsSchema),
    });

    const {
        data: newAccount,
        error,
        func: createAccountFunc,
        loading: createAccountLoading,
    } = useFetch(createAccount);

    const onSubmit = async (data: userAccountsModel) => {
        await createAccountFunc(data);
        console.log(data);
    };

    useEffect(() => {
        if (newAccount && !createAccountLoading) {
            toast.success("Account created successfully");
            reset();
            setIsDrawerOpen(false);
        }
    }, [newAccount, createAccountLoading]);

    useEffect(() => {
        if (error) {
            toast.error(error || "Failed to create an account");
        }
    }, [error]);

    return (
        <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-center">Create New Account</DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4 mt-2">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="text-sm font-medium px-1">
                                Account name
                            </label>
                            <Input {...register("name")} id="name" placeholder="Enter account name" />
                            {errors.name && <span className="text-red-500 text-xs px-1">{errors.name.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="type" className="text-sm font-medium px-1">
                                Account type
                            </label>
                            <Select
                                value={watch("type")} // Updated from `defaultValue`
                                onValueChange={(value: "CURRENT" | "SAVINGS") => setValue("type", value)}
                            >
                                <SelectTrigger id="type" className="w-full">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="CURRENT">Current</SelectItem>
                                    <SelectItem value="SAVINGS">Savings</SelectItem>
                                </SelectContent>
                            </Select>
                            {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="balance" className="text-sm font-medium px-1">
                                Initial Balance
                            </label>
                            <Input {...register("balance")} id="balance" placeholder="Enter initial balance" />
                            {errors.balance && <span className="text-red-500 text-xs px-1">{errors.balance.message}</span>}
                        </div>

                        <div className="flex flex-col gap-1 justify-between rounded-lg border p-3">
                            <div className="w-full flex justify-between">
                                <label htmlFor="isDefault" className="text-sm font-medium">
                                    Set as Default
                                </label>
                                <Switch
                                    id="isDefault"
                                    checked={watch("isDefault")}
                                    onCheckedChange={(checked) => setValue("isDefault", checked)}
                                />
                            </div>
                            <span className="text-xs text-blue-500 font-medium">
                                This account will be set as default for all transactions
                            </span>
                        </div>

                        <div className="mt-5 flex gap-2">
                            <Button disabled={createAccountLoading} type="submit" className="w-full">
                                {createAccountLoading ? (
                                    <span className="flex items-center gap-2">
                                        <Loader2 className="h-4 w-4 animate-spin" /> Creating account...
                                    </span>
                                ) : (
                                    "Create an account"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAccountDrawer;
