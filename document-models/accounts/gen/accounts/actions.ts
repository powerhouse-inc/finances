import { type Action } from "document-model";
import type {
  AddAccountInput,
  UpdateAccountInput,
  DeleteAccountInput,
  UpdateKycStatusInput,
} from "../types.js";

export type AddAccountAction = Action & {
  type: "ADD_ACCOUNT";
  input: AddAccountInput;
};
export type UpdateAccountAction = Action & {
  type: "UPDATE_ACCOUNT";
  input: UpdateAccountInput;
};
export type DeleteAccountAction = Action & {
  type: "DELETE_ACCOUNT";
  input: DeleteAccountInput;
};
export type UpdateKycStatusAction = Action & {
  type: "UPDATE_KYC_STATUS";
  input: UpdateKycStatusInput;
};

export type AccountsAccountsAction =
  | AddAccountAction
  | UpdateAccountAction
  | DeleteAccountAction
  | UpdateKycStatusAction;
