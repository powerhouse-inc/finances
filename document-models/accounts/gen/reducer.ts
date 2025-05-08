import {
  type StateReducer,
  isDocumentAction,
  createReducer,
} from "document-model";
import { type AccountsDocument, z } from "./types.js";

import { reducer as AccountsReducer } from "../src/reducers/accounts.js";

const stateReducer: StateReducer<AccountsDocument> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "CREATE_ACCOUNT":
      z.CreateAccountInputSchema().parse(action.input);
      AccountsReducer.createAccountOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "UPDATE_ACCOUNT":
      z.UpdateAccountInputSchema().parse(action.input);
      AccountsReducer.updateAccountOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    case "DELETE_ACCOUNT":
      z.DeleteAccountInputSchema().parse(action.input);
      AccountsReducer.deleteAccountOperation(
        state[action.scope],
        action,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<AccountsDocument>(stateReducer);
