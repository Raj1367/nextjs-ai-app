import React, { FC, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"


interface budgetType {
  id: string
  amount: number
  lastAlertSent?: Date
  userId?: String
}

interface currentExpensesType {
  currentExpenses: any
}

interface budgetProgressProps {
  initialBudget: budgetType,
  currentExpenses: currentExpensesType
}

const BudgetProgress: FC<budgetProgressProps> = ({ initialBudget, currentExpenses }) => {

  const [isEditing, setIsEditing] = useState(false)
  const [newBudget, setNewBudget] = useState(initialBudget?.amount?.toString())

  const 

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly budghet (default Account)</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
    </Card>

  )
}

export default BudgetProgress