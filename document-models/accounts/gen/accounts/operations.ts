import { type SignalDispatch } from "document-model";
import {
  type CreateAccountAction,
  type UpdateAccountAction,
  type DeleteAccountAction,
} from "./actions.js";
import { type AccountsState } from "../types.js";

export interface AccountsAccountsOperations {
  createAccountOperation: (
    state: AccountsState,
    action: CreateAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
  updateAccountOperation: (
    state: AccountsState,
    action: UpdateAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
  deleteAccountOperation: (
    state: AccountsState,
    action: DeleteAccountAction,
    dispatch?: SignalDispatch,
  ) => void;
}
