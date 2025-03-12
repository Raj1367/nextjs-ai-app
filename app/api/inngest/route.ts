import { serve } from "inngest/next";
import { inngest } from "../../../lib/inngest/client";
import { checkBudgetAlerts } from "@/lib/inngest/functions";


// Use the serve function correctly
const apiHandler = serve({
  client: inngest,
  functions: [checkBudgetAlerts]
});

// Then export the methods if `serve` returns them
export const { GET, POST, PUT } = apiHandler;
