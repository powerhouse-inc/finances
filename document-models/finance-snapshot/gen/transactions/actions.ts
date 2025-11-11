import { type Action } from "document-model";
import type { AddTransactionInput } from "../types.js";

export type AddTransactionAction = Action & {
  type: "ADD_TRANSACTION";
  input: AddTransactionInput;
};

export type FinanceSnapshotTransactionsAction = AddTransactionAction;
