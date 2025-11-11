import type { FinanceSnapshotSnapshotOperations } from "../../gen/snapshot/operations.js";

export const reducer: FinanceSnapshotSnapshotOperations = {
    createSnapshotOperation(state, action) {
        state.id = action.input.id;
        state.name = action.input.name;
        state.period = action.input.period;
        state.periodStart = action.input.periodStart;
        state.periodEnd = action.input.periodEnd;
        state.owner = action.input.owner;
        state.created = action.input.created;
    },
    addWalletOperation(state, action) {
        const wallet = {
            id: action.input.id,
            address: action.input.address,
            accountType: action.input.accountType,
            label: action.input.label,
            accountTransactionsRef: action.input.accountTransactionsRef || null
        };
        state.wallets.push(wallet);
    },
    removeWalletOperation(state, action) {
        const index = state.wallets.findIndex(wallet => wallet.id === action.input.walletId);
        if (index !== -1) {
            state.wallets.splice(index, 1);
            // Also remove related transactions and balances
            state.transactions = state.transactions.filter(tx =>
                !(state.wallets.some(w => w.address === tx.counterParty))
            );
            state.balances = state.balances.filter(balance =>
                state.wallets.some(w => w.address === balance.walletAddress)
            );
        }
    },
    updatePeriodOperation(state, action) {
        state.periodStart = action.input.periodStart;
        state.periodEnd = action.input.periodEnd;
        state.period = action.input.period;
        // Clear existing data when period changes as it may no longer be valid
        state.transactions = [];
        state.balances = [];
    },
    refreshSnapshotDataOperation(state, action) {
        if (action.input.clearExistingData) {
            state.transactions = [];
            state.balances = [];
        }
        // The actual data fetching and population would be handled in the editor/UI layer
        // This reducer just prepares the state for new data
    }
};
