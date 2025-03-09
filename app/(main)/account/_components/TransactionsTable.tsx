"use client";
import React, { FC, useEffect, useMemo, useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { categoryColors } from "@/app/data/categories";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { Badge } from "@/components/ui/badge";

import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Clock,
  MoreHorizontal,
  RefreshCw,
  Search,
  Trash,
  X,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

const RECURRING_INTERVALS = {
  DAILY: "Daily",
  WEEKLY: "Weekly",
  MONTHLY: "Monthly",
  YEARLY: "Yearly",
};

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useFetch from "@/app/hooks/useFetch";
import { toast } from "sonner";
import { BarLoader } from "react-spinners";
import { bulkDeleteTransactions } from "@/actions/accounts";

interface TransactionsProps {
  transactions: TransactionsAllTypes;
}

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

const TransactionsTable: FC<TransactionsProps> = ({ transactions }) => {

  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [sortConfig, setSortConfig] = useState({
    field: "date",
    direction: "desc",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [recurringFilter, setRecurringFilter] = useState("");

  const {
    loading: deleteSelectedTransactionsLoading,
    data: deleteSelectedTransactions,
    func: deleteSelectedTranstionsFunc,
    error,
  } = useFetch(bulkDeleteTransactions);

  const handleSort = (field: string) => {
    setSortConfig((curr) => ({
      field,
      direction:
        curr.field === field && curr.direction === "asc" ? "desc" : "asc",
    }));
  };

  const filteredAndSortedTransactions = useMemo(() => {

    let result = [...transactions];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter((t) =>
        t.description?.toLowerCase().includes(search)
      );
    }

    // Recurring filter
    if (recurringFilter) {
      result = result.filter((transaction) =>
        recurringFilter === "recurring"
          ? transaction.isRecurring
          : !transaction.isRecurring
      );
    }

    // Type filter
    if (typeFilter) {
      result = result.filter((transaction) => transaction.type === typeFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortConfig.field) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;

        case "amount":
          comparison = a.amount - b.amount;
          break;

        case "category":
          comparison = a.category.localeCompare(b.category);
          break;

        default:
          comparison = 0;
      }

      return sortConfig.direction === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, recurringFilter, sortConfig]);


  // pagination calculations

  const [currentPage, setCurrentPage] = useState(1)

  const itemsPerPage = 10

  const totalPages = Math.ceil(
    filteredAndSortedTransactions.length / itemsPerPage
  )

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredAndSortedTransactions.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredAndSortedTransactions, currentPage])

  const handlepageChange = (newPage) => {
    setCurrentPage(newPage)
    setSelectedIds([])
  }


  // select calculations

  const handleSelect = (id: string) => {
    setSelectedIds((curr) =>
      curr.includes(id) ? curr.filter((item) => item !== id) : [...curr, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedIds((curr) =>
      curr.length === paginatedTransactions.length
        ? []
        : paginatedTransactions.map((t: any) => t.id)
    );
  };

  console.log(selectedIds);

  const handleClearFilters = () => {
    setSearchTerm("");
    setTypeFilter("");
    setRecurringFilter("");
    setSelectedIds([]);
  };


  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) {
      toast.error("No transactions selected.");
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} transactions?`)) {
      return;
    }

    try {

      const response = await deleteSelectedTranstionsFunc(selectedIds);

      if (response.success) {
        toast.success("Transactions deleted successfully");
        setSelectedIds([]); // Clear selected transactions
        router.refresh(); // Refresh transactions
      }
      else {
        throw new Error(response.error || "Failed to delete transactions");
      }
    } catch (error) {
      console.error("Error deleting transactions:", error);
      toast.error("Failed to delete transactions");
    }
  };


  useEffect(() => {
    if (deleteSelectedTransactions && !deleteSelectedTransactionsLoading) {
      toast.success("Transactions deleted successfully");
      setSelectedIds([]);
    }
  }, [deleteSelectedTransactions, deleteSelectedTransactionsLoading]);


  return (
    <div className="space-y-4">
      {deleteSelectedTransactionsLoading && (<BarLoader className="mt-4" width={"100%"} color="#9333ea" />)}
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8"
            placeholder="search transactions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="EXPENSE">Expense</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={recurringFilter}
            onValueChange={(value) => setRecurringFilter(value)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="All Transactions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recurring">recurring</SelectItem>
              <SelectItem value="non-recurring">non-recurring</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {selectedIds.length > 0 && (
          <div>
            <Button variant="destructive" onClick={handleBulkDelete}>
              <Trash className="h-4 w-4 mr-2" /> Delete Selected (
              {selectedIds.length})
            </Button>
          </div>
        )}

        {(searchTerm || typeFilter || recurringFilter) && (
          <Button
            variant="outline"
            size="icon"
            onClick={handleClearFilters}
            title="clear filters"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Transactions Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  onCheckedChange={handleSelectAll}
                  checked={
                    selectedIds.length ===
                    paginatedTransactions.length &&
                    paginatedTransactions.length > 0
                  }
                />
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("date")}
              >
                <div className="flex items-center">
                  Date
                  {sortConfig.field === "date" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead>Description</TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("category")}
              >
                <div className="flex items-center">
                  Category
                  {sortConfig.field === "category" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("amount")}
              >
                <div className="flex items-center">
                  Amount
                  {sortConfig.field === "amount" &&
                    (sortConfig.direction === "asc" ? (
                      <ChevronUp className="ml-1 h-4 w-4" />
                    ) : (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    ))}
                </div>
              </TableHead>
              <TableHead className="text-right">Recurring</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center text-muted-foreground"
                >
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    <Checkbox
                      onCheckedChange={() => handleSelect(transaction.id)}
                      checked={selectedIds.includes(transaction.id)}
                    />
                  </TableCell>
                  <TableCell>
                    {format(new Date(transaction.date), "PP")}
                  </TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <span
                      className="px-2 py-1 rounded text-white"
                      style={{
                        backgroundColor: categoryColors[transaction.category],
                      }}
                    >
                      {transaction.category}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`${transaction.type === "EXPENSE"
                        ? "text-red-500"
                        : "text-green-500"
                        } font-medium`}
                    >
                      {transaction.type === "EXPENSE" ? "-" : "+"} $
                      {transaction.amount.toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    {transaction.isRecurring ? (
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge
                              variant="outline"
                              className="gap-1 bg-purple-100 text-purple-700 hover:bg-purple-200"
                            >
                              <RefreshCw className="h-4 w-3" />
                              {
                                RECURRING_INTERVALS[
                                transaction.recurringInterval
                                ]
                              }
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <div>
                              <div className="text-xs">Next Date:</div>
                              <div className="text-xs">
                                {format(
                                  new Date(transaction.nextRecurringDate),
                                  "PP"
                                )}
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ) : (
                      <Badge variant="outline" className="gap-1">
                        <Clock className="h-4 w-3" /> One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            router.push(
                              `/transaction/create?edit=${transaction.id}`
                            )
                          }
                          className="text-blue-500"
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500" onClick={() => deleteSelectedTranstionsFunc([transaction.id])}>
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* pagination */}
      {
        totalPages > 1 && (
          <div className="flex justify-center items-center my-5">

            <Button disabled={currentPage === 1} onClick={() => handlepageChange(currentPage - 1)} variant="outline" size="icon">
              <ChevronLeft />
            </Button>

            <span className="text-sm px-4">
              Page {currentPage} of {totalPages}
            </span>

            <Button disabled={currentPage === totalPages} onClick={() => handlepageChange(currentPage + 1)} variant="outline" size="icon" >
              <ChevronRight />
            </Button>

          </div>
        )
      }

    </div>
  );
};

export default TransactionsTable;
