import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { checkBudget } from "@/lib/inngest/functions";

// Use the serve function correctly
const apiHandler = serve({
  client: inngest,
  functions: [checkBudget]
});

// Then export the methods if `serve` returns them
export const { GET, POST, PUT } = apiHandler;
