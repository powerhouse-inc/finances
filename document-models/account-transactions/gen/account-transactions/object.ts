import { BaseDocumentClass } from "document-model";
import {
  type CreateTransactionInput,
  type UpdateTransactionInput,
  type DeleteTransactionInput,
  type UpdateTransactionBudgetInput,
  type UpdateAccountInput,
  type AccountTransactionsState,
  type AccountTransactionsLocalState,
} from "../types.js";
import {
  createTransaction,
  updateTransaction,
  deleteTransaction,
  updateTransactionBudget,
  updateAccount,
} from "./creators.js";
import { type AccountTransactionsAction } from "../actions.js";

export default class AccountTransactions_AccountTransactions extends BaseDocumentClass<
  AccountTransactionsState,
  AccountTransactionsLocalState,
  AccountTransactionsAction
> {
  public createTransaction(input: CreateTransactionInput) {
    return this.dispatch(createTransaction(input));
  }

  public updateTransaction(input: UpdateTransactionInput) {
    return this.dispatch(updateTransaction(input));
  }

  public deleteTransaction(input: DeleteTransactionInput) {
    return this.dispatch(deleteTransaction(input));
  }

  public updateTransactionBudget(input: UpdateTransactionBudgetInput) {
    return this.dispatch(updateTransactionBudget(input));
  }

  public updateAccount(input: UpdateAccountInput) {
    return this.dispatch(updateAccount(input));
  }
}
