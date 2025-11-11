import { type SignalDispatch } from "document-model";
import { type AddTransactionAction } from "./actions.js";
import { type FinanceSnapshotState } from "../types.js";

export interface FinanceSnapshotTransactionsOperations {
  addTransactionOperation: (
    state: FinanceSnapshotState,
    action: AddTransactionAction,
    dispatch?: SignalDispatch,
  ) => void;
}
