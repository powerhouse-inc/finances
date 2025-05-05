import { type BaseAction } from "document-model";
import type {
  CreateAccountInput,
  UpdateAccountInput,
  DeleteAccountInput,
} from "../types.js";

export type CreateAccountAction = BaseAction<
  "CREATE_ACCOUNT",
  CreateAccountInput,
  "global"
>;
export type UpdateAccountAction = BaseAction<
  "UPDATE_ACCOUNT",
  UpdateAccountInput,
  "global"
>;
export type DeleteAccountAction = BaseAction<
  "DELETE_ACCOUNT",
  DeleteAccountInput,
  "global"
>;

export type AccountsAccountsAction =
  | CreateAccountAction
  | UpdateAccountAction
  | DeleteAccountAction;
