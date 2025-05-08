import { createAction } from "document-model";
import {
  z,
  type CreateTransactionInput,
  type UpdateTransactionInput,
  type DeleteTransactionInput,
  type UpdateTransactionBudgetInput,
  type UpdateAccountInput,
} from "../types.js";
import {
  type CreateTransactionAction,
  type UpdateTransactionAction,
  type DeleteTransactionAction,
  type UpdateTransactionBudgetAction,
  type UpdateAccountAction,
} from "./actions.js";

export const createTransaction = (input: CreateTransactionInput) =>
  createAction<CreateTransactionAction>(
    "CREATE_TRANSACTION",
    { ...input },
    undefined,
    z.CreateTransactionInputSchema,
    "global",
  );

export const updateTransaction = (input: UpdateTransactionInput) =>
  createAction<UpdateTransactionAction>(
    "UPDATE_TRANSACTION",
    { ...input },
    undefined,
    z.UpdateTransactionInputSchema,
    "global",
  );

export const deleteTransaction = (input: DeleteTransactionInput) =>
  createAction<DeleteTransactionAction>(
    "DELETE_TRANSACTION",
    { ...input },
    undefined,
    z.DeleteTransactionInputSchema,
    "global",
  );

export const updateTransactionBudget = (input: UpdateTransactionBudgetInput) =>
  createAction<UpdateTransactionBudgetAction>(
    "UPDATE_TRANSACTION_BUDGET",
    { ...input },
    undefined,
    z.UpdateTransactionBudgetInputSchema,
    "global",
  );

export const updateAccount = (input: UpdateAccountInput) =>
  createAction<UpdateAccountAction>(
    "UPDATE_ACCOUNT",
    { ...input },
    undefined,
    z.UpdateAccountInputSchema,
    "global",
  );
