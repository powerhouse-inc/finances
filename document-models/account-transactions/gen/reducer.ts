import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { type AccountTransactionsDocument, z } from "./types.js";

import { reducer as AccountTransactionsReducer } from "../src/reducers/account-transactions.js";

const stateReducer: StateReducer<AccountTransactionsDocument> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "CREATE_TRANSACTION":
      z.CreateTransactionInputSchema().parse(action.input);
      AccountTransactionsReducer.createTransactionOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "UPDATE_TRANSACTION":
      z.UpdateTransactionInputSchema().parse(action.input);
      AccountTransactionsReducer.updateTransactionOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "DELETE_TRANSACTION":
      z.DeleteTransactionInputSchema().parse(action.input);
      AccountTransactionsReducer.deleteTransactionOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "UPDATE_TRANSACTION_BUDGET":
      z.UpdateTransactionBudgetInputSchema().parse(action.input);
      AccountTransactionsReducer.updateTransactionBudgetOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "UPDATE_ACCOUNT":
      z.UpdateAccountInputSchema().parse(action.input);
      AccountTransactionsReducer.updateAccountOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<AccountTransactionsDocument>(stateReducer);
