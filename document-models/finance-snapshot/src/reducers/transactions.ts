import type { FinanceSnapshotTransactionsOperations } from "../../gen/transactions/operations.js";

export const reducer: FinanceSnapshotTransactionsOperations = {
    addTransactionOperation(state, action) {
        const transaction = {
            id: action.input.id,
            block: action.input.block || null,
            timestamp: action.input.timestamp,
            txHash: action.input.txHash,
            token: action.input.token,
            counterParty: action.input.counterParty,
            amount: action.input.amount,
            txLabel: action.input.txLabel || null,
            counterPartyName: action.input.counterPartyName || null,
            flowType: action.input.flowType,
            fromWalletType: action.input.fromWalletType || null,
            toWalletType: action.input.toWalletType || null
        };
        state.transactions.push(transaction);
    }
};
