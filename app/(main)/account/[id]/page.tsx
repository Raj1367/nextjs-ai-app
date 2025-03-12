import { getAccountsWithTransactions } from '@/actions/accounts'
import { notFound } from 'next/navigation'
import React, { FC, Suspense } from 'react'
import TransactionsTable from '../_components/TransactionsTable'
import { BarLoader } from 'react-spinners'
import AccountChart from '../_components/AccountChart'

interface ParamsType {
    params: { id: string }
}

const AccountPage: FC<ParamsType> = async ({ params }) => {

    const getParams = await params

    const accountData = await getAccountsWithTransactions(getParams.id)

    if (!accountData) {
        notFound()
    }

    return (
        <div className="flex justify-center items-center">
            <div className="container space-y-6">
                {/* Account Info */}
                <div className="flex justify-between items-center gap-4 py-6">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight gradient-title capitalize">
                            {accountData.name}
                        </h1>
                        <div className="text-muted-foreground flex items-center space-x-2">
                            <h5 className="font-semibold">Account Type:</h5>
                            <span>{accountData.type.toLowerCase()}</span>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xl md:text-2xl font-bold">
                            ${parseFloat(accountData.balance).toFixed(2)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                            {accountData._count.transactions} transactions
                        </p>
                    </div>
                </div>

                {/* Chart Section */}

                <Suspense fallback={<BarLoader className="mt-4" width={"100%"} color="#9333ea" />}>
                    <AccountChart transactions={accountData.transactions} />
                </Suspense>

                {/* Transactions Table */}
                {accountData.transactions.length > 0 ? (
                    <TransactionsTable transactions={accountData.transactions} />
                ) : (
                    <p className="text-center text-muted-foreground py-4">No transactions found.</p>
                )}
            </div>
        </div>
    )
}

export default AccountPage
