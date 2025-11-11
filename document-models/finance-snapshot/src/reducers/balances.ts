import type { FinanceSnapshotBalancesOperations } from "../../gen/balances/operations.js";

export const reducer: FinanceSnapshotBalancesOperations = {
    updateWalletBalanceOperation(state, action) {
        // Find existing balance for this wallet and token combination
        const existingIndex = state.balances.findIndex(
            balance =>
                balance.walletAddress === action.input.walletAddress &&
                balance.token === action.input.token
        );

        const balanceData = {
            id: action.input.id,
            walletAddress: action.input.walletAddress,
            accountType: action.input.accountType,
            token: action.input.token,
            startingBalance: action.input.startingBalance,
            endingBalance: action.input.endingBalance,
            externalInflow: action.input.externalInflow,
            externalOutflow: action.input.externalOutflow,
            internalInflow: action.input.internalInflow,
            internalOutflow: action.input.internalOutflow,
            netExternalChange: action.input.netExternalChange
        };

        if (existingIndex !== -1) {
            // Update existing balance
            state.balances[existingIndex] = balanceData;
        } else {
            // Add new balance entry
            state.balances.push(balanceData);
        }
    }
};
