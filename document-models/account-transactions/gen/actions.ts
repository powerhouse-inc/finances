import type { AccountTransactionsTransactionsAction } from "./transactions/actions.js";
import type { AccountTransactionsBudgetsAction } from "./budgets/actions.js";

export * from "./transactions/actions.js";
export * from "./budgets/actions.js";

export type AccountTransactionsAction =
  | AccountTransactionsTransactionsAction
  | AccountTransactionsBudgetsAction;
