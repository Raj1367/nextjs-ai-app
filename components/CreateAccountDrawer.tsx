"use client";
import React, { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import userAccountsModel, { accountsSchema } from "@/app/Schema/AccountSchema";
import { Input } from "./ui/input";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"


interface childrenProps {
    children: any;
}

const CreateAccountDrawer: FC<childrenProps> = ({ children }) => {

    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const {
        control,
        register,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<userAccountsModel>({
        defaultValues: {
            name: "",
            type: "CURRENT",
            balance: "",
            isDefault: false
        },
        resolver: zodResolver(accountsSchema),
    });

    return (
        <Dialog open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Account</DialogTitle>
                </DialogHeader>
                <div className="px-4 pb-4">
                    <form action="" className="space-y-4">

                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">Account name</label>
                            <div>
                                <Input {...register("name")} id="name" placeholder="enter account name" />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="type" className="text-sm font-medium">Account type</label>
                            <div>
                                <Select defaultValue={watch("type")} onValueChange={(value: "CURRENT" | "SAVINGS") => setValue("type", value)}>
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="CURRENT">current</SelectItem>
                                        <SelectItem value="SAVINGS">savings</SelectItem>

                                    </SelectContent>
                                </Select>
                                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
                            </div>
                        </div>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default CreateAccountDrawer;
