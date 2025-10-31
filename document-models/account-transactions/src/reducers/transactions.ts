import type { AccountTransactionsTransactionsOperations } from "../../gen/transactions/operations.js";

export const reducer: AccountTransactionsTransactionsOperations = {
    addTransactionOperation(state, action) {
        state.transactions.push({
            id: action.input.id,
            counterParty: action.input.counterParty || "",
            amount: action.input.amount || 0,
            datetime: action.input.datetime || new Date().toISOString(),
            details: {
                txHash: action.input.txHash || "",
                token: action.input.token || "",
                blockNumber: action.input.blockNumber || 0,
            },
            budget: action.input.budget || "",
            accountingPeriod: action.input.accountingPeriod || "",
        });
    },
    updateTransactionOperation(state, action) {
        const transaction = state.transactions.find((transaction) => transaction.id === action.input.id);
        if (!transaction) {
            throw new Error(`Transaction with id ${action.input.id} not found`);
        }
        transaction.counterParty = action.input.counterParty || "";
        transaction.amount = action.input.amount || { unit: "", value: "" };
        transaction.datetime = action.input.datetime || new Date().toISOString();
        transaction.details.txHash = action.input.txHash || "";
        transaction.details.token = action.input.token || "";
    },
    deleteTransactionOperation(state, action) {
        state.transactions = state.transactions.filter((transaction) => transaction.id !== action.input.id);
    },
    updateTransactionPeriodOperation(state, action) {
        const transaction = state.transactions.find((transaction) => transaction.id === action.input.id);
        if (!transaction) {
            throw new Error(`Transaction with id ${action.input.id} not found`);
        }
        transaction.accountingPeriod = action.input.accountingPeriod || "";
    }
};
