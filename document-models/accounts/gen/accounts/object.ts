import { BaseDocumentClass } from "document-model";
import {
  type CreateAccountInput,
  type UpdateAccountInput,
  type DeleteAccountInput,
  type AccountsState,
  type AccountsLocalState,
} from "../types.js";
import { createAccount, updateAccount, deleteAccount } from "./creators.js";
import { type AccountsAction } from "../actions.js";

export default class Accounts_Accounts extends BaseDocumentClass<
  AccountsState,
  AccountsLocalState,
  AccountsAction
> {
  public createAccount(input: CreateAccountInput) {
    return this.dispatch(createAccount(input));
  }

  public updateAccount(input: UpdateAccountInput) {
    return this.dispatch(updateAccount(input));
  }

  public deleteAccount(input: DeleteAccountInput) {
    return this.dispatch(deleteAccount(input));
  }
}
