import { type SignalDispatch } from "document-model";
import {
  type CreateTransactionAction,
  type UpdateTransactionAction,
  type DeleteTransactionAction,
  type UpdateTransactionBudgetAction,
  type UpdateAccountAction,
} from "./actions.js";
import { type AccountTransactionsState } from "../types.js";

export interface AccountTransactionsAccountTransactionsOperations {
  createTransactionOperation: (
    state: AccountTransactionsState,
    action: CreateTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTransactionOperation: (
    state: AccountTransactionsState,
    action: UpdateTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteTransactionOperation: (
    state: AccountTransactionsState,
    action: DeleteTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateTransactionBudgetOperation: (
    state: AccountTransactionsState,
    action: UpdateTransactionBudgetAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateAccountOperation: (
    state: AccountTransactionsState,
    action: UpdateAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
}
