import { getuserAccounts } from "@/actions/dashboard";
import { defaultCategories } from "@/app/data/categories";
import React, { FC } from "react";
import AddTransactionForm from "../_components/AddTransactionForm";
import { getTransaction } from "@/actions/transaction";

interface ParamsProps {
  searchParams: { edit?: string };
}

const AddTransactionPage: FC<ParamsProps> = async ({ searchParams }) => {

  const accounts = await getuserAccounts();

  const editId = await searchParams?.edit;
  // console.log(editId);

  let initialData = null;
  if (editId) {
    const transaction = await getTransaction(editId);
    initialData = transaction;
  }

  return (
    <div className="max-w-3xl mx-auto px-5">
      <h1 className="text-5xl gradient-title mb-8">
        {editId ? "Edit Transaction" : "Add Transaction"}
      </h1>
      <AddTransactionForm
        accounts={accounts}
        categories={defaultCategories}
        editMode={!!editId}
        initialData={initialData}
      />
    </div>
  );
};

export default AddTransactionPage;
