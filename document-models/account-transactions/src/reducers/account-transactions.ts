/**
 * This is a scaffold file meant for customization:
 * - modify it by implementing the reducer functions
 * - delete the file and run the code generator again to have it reset
 */

import { hashKey } from "document-model";
import type { AccountTransactionsAccountTransactionsOperations } from "../../gen/account-transactions/operations.js";

export const reducer: AccountTransactionsAccountTransactionsOperations = {
  createTransactionOperation(state, action, dispatch) {
    // Initialize transactions array if it doesn't exist
    if (!state.transactions) {
      state.transactions = [];
    }

    state.transactions.push({
      id: action.input.id,
      counterParty: action.input.counterParty || null,
      amount: action.input.amount,
      datetime: action.input.datetime,
      details: {
        txHash: action.input.details.txHash,
        token: action.input.details.token,
        blockNumber: action.input.details.blockNumber || null
      },
      budget: action.input.budget || null
    });
  },

  updateTransactionOperation(state, action, dispatch) {
    const transaction = state.transactions.find(tx => tx.id === action.input.id);
    if (!transaction) {
      throw new Error(`Transaction with id ${action.input.id} not found`);
    }

    if (action.input.counterParty !== undefined) {
      transaction.counterParty = action.input.counterParty;
    }
    if (action.input.amount !== undefined) {
      transaction.amount = action.input.amount || 0;
    }
    if (action.input.datetime !== undefined) {
      transaction.datetime = action.input.datetime || "";
    }
    if (action.input.details !== undefined) {
      transaction.details = {
        ...transaction.details,
        ...action.input.details
      };
    }
    if (action.input.budget !== undefined) {
      transaction.budget = action.input.budget;
    }
  },

  deleteTransactionOperation(state, action, dispatch) {
    const transactionIndex = state.transactions.findIndex(tx => tx.id === action.input.id);
    if (transactionIndex === -1) {
      throw new Error(`Transaction with id ${action.input.id} not found`);
    }

    state.transactions = state.transactions.filter(tx => tx.id !== action.input.id);
  },

  updateTransactionBudgetOperation(state, action, dispatch) {
    const transaction = state.transactions.find(tx => tx.id === action.input.txId);
    if (!transaction) {
      throw new Error(`Transaction with id ${action.input.txId} not found`);
    }

    transaction.budget = action.input.budgetId;
  },

  updateAccountOperation(state, action, dispatch) {
    // Initialize account if it doesn't exist
    if (!state.account) {
      state.account = {
        id: hashKey(),
        username: action.input.account || null,
        type: "CONTRIBUTOR",
        icon: null
      };
    }

    state.account.username = action.input.account || null;
  },
};
