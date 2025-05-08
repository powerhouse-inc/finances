import { type BaseAction } from "document-model";
import type {
  CreateTransactionInput,
  UpdateTransactionInput,
  DeleteTransactionInput,
  UpdateTransactionBudgetInput,
  UpdateAccountInput,
} from "../types.js";

export type CreateTransactionAction = BaseAction<
  "CREATE_TRANSACTION",
  CreateTransactionInput,
  "global"
>;
export type UpdateTransactionAction = BaseAction<
  "UPDATE_TRANSACTION",
  UpdateTransactionInput,
  "global"
>;
export type DeleteTransactionAction = BaseAction<
  "DELETE_TRANSACTION",
  DeleteTransactionInput,
  "global"
>;
export type UpdateTransactionBudgetAction = BaseAction<
  "UPDATE_TRANSACTION_BUDGET",
  UpdateTransactionBudgetInput,
  "global"
>;
export type UpdateAccountAction = BaseAction<
  "UPDATE_ACCOUNT",
  UpdateAccountInput,
  "global"
>;

export type AccountTransactionsAccountTransactionsAction =
  | CreateTransactionAction
  | UpdateTransactionAction
  | DeleteTransactionAction
  | UpdateTransactionBudgetAction
  | UpdateAccountAction;
