"use client"
import React, { FC, useEffect } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import useFetch from "@/app/hooks/useFetch";
import { updateDefaultAccount } from "@/actions/accounts";
import { toast } from "sonner";

interface accountProps {
    account: any;
}

const AccountCard: FC<accountProps> = ({ account }) => {

    const {
        loading: updateDefaultLoading,
        data: updateAccount,
        func: updateDefaultFunc,
        error,
        setData,
    } = useFetch(updateDefaultAccount);

    const handleDefaultChange = async (e) => {
        e.preventDefault()

        if (account.isDefault) {
            toast.warning("you need atleast 1 default account")
            return
        }

        await updateDefaultFunc(account.id)
    }

    useEffect(() => {
        if (updateAccount && !updateDefaultLoading) {
            toast.success("default account updated successfully");
        }
    }, [updateAccount, updateDefaultLoading]);

    useEffect(() => {
        if (error) {
            toast.error(error || "Failed to update to default account");
        }
    }, [error]);

    return (
        <Card className="hover:shadow-md transition-shadow group relative">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <Link href={`/account/${account.id}`}>
                    <CardTitle className="capitalize hover:text-blue-500 transition-colors">
                        {account.name}
                    </CardTitle>
                </Link>
                <Switch onClick={handleDefaultChange} disabled={updateDefaultLoading} checked={account.isDefault} />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    ${parseFloat(account.balance).toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground capitalize">
                    {account.type.toLowerCase()} Account
                </p>
            </CardContent>
            <CardFooter className="flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                    <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                    Income
                </div>

                <div className="flex items-center">
                    <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
                    Expense
                </div>
            </CardFooter>
        </Card>
    );
};

export default AccountCard;
