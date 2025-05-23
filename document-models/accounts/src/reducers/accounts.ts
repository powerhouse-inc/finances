/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import type { AccountsAccountsOperations } from "../../gen/accounts/operations.js";

export const reducer: AccountsAccountsOperations = {
  createAccountOperation(state, action, dispatch) {
    state.accounts.push({
      id: action.input.id,
      name: action.input.name || "",
      accountTransactionsId: action.input.accountTransactionsId || "",
      chain: action.input.chain || "",
      account: action.input.account || "",
      budgetPath: action.input.budgetPath || "",
      type: action.input.type || "Protocol",
      owners: (action.input.owners || []).filter((owner): owner is string => owner !== undefined),
    });
  },

  updateAccountOperation(state, action, dispatch) {
    const account = state.accounts.find(
      (account) => account.id === action.input.id,
    );
    if (!account) {
      throw new Error(`Account with id ${action.input.id} not found`);
    }

    // Update account properties if provided in the input
    if (action.input.name !== undefined) {
      account.name = action.input.name;
    }
    if (action.input.accountTransactionsId !== undefined) {
      account.accountTransactionsId = action.input.accountTransactionsId;
    }
    if (action.input.chain !== undefined) {
      account.chain = action.input.chain;
    }
    if (action.input.account !== undefined) {
      account.account = action.input.account;
    }
    if (action.input.budgetPath !== undefined) {
      account.budgetPath = action.input.budgetPath;
    }
    if (action.input.type !== undefined) {
      account.type = action.input.type;
    }
    if (action.input.owners !== undefined && action.input.owners !== null) {
      account.owners = action.input.owners.filter((owner): owner is string => owner !== undefined);
    }
  },

  deleteAccountOperation(state, action, dispatch) {
    // Verify account exists before deletion
    const account = state.accounts.find(
      (account) => account.id === action.input.id,
    );
    if (!account) {
      throw new Error(`Account with id ${action.input.id} not found`);
    }

    // Remove account from the accounts array
    state.accounts = state.accounts.filter(
      (account) => account.id !== action.input.id,
    );
  },
};
