import { type Action } from "document-model";
import type {
  AddTransactionInput,
  UpdateTransactionInput,
  DeleteTransactionInput,
  UpdateTransactionPeriodInput,
} from "../types.js";

export type AddTransactionAction = Action & {
  type: "ADD_TRANSACTION";
  input: AddTransactionInput;
};
export type UpdateTransactionAction = Action & {
  type: "UPDATE_TRANSACTION";
  input: UpdateTransactionInput;
};
export type DeleteTransactionAction = Action & {
  type: "DELETE_TRANSACTION";
  input: DeleteTransactionInput;
};
export type UpdateTransactionPeriodAction = Action & {
  type: "UPDATE_TRANSACTION_PERIOD";
  input: UpdateTransactionPeriodInput;
};

export type AccountTransactionsTransactionsAction =
  | AddTransactionAction
  | UpdateTransactionAction
  | DeleteTransactionAction
  | UpdateTransactionPeriodAction;
