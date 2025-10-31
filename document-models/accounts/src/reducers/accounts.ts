import type { AccountsAccountsOperations } from "../../gen/accounts/operations.js";

export const reducer: AccountsAccountsOperations = {
    addAccountOperation(state, action) {
        state.accounts.push({
            id: action.input.id,
            account: action.input.account || "",
            name: action.input.name || "",
            budgetPath: action.input.budgetPath || "",
            accountTransactionsId: action.input.accountTransactionsId || "",
            chain: action.input.chain || [],
            type: action.input.type || "Protocol",
            owners: action.input.owners || [],
            KycAmlStatus: action.input.KycAmlStatus || "PENDING",
        });
    },
    updateAccountOperation(state, action) {
        const account = state.accounts.find((account) => account.id === action.input.id);
        if (!account) {
            throw new Error(`Account with id ${action.input.id} not found`);
        }
        account.account = action.input.account || "";
        account.name = action.input.name || "";
        account.budgetPath = action.input.budgetPath || "";
        account.accountTransactionsId = action.input.accountTransactionsId || "";
        account.chain = action.input.chain || [];
        account.type = action.input.type || "Protocol";
        account.owners = action.input.owners || [];
        account.KycAmlStatus = action.input.KycAmlStatus || "PENDING";
    },
    deleteAccountOperation(state, action) {
        state.accounts = state.accounts.filter((account) => account.id !== action.input.id);
    },
    updateKycStatusOperation(state, action) {
        const account = state.accounts.find((account) => account.id === action.input.id);
        if (!account) {
            throw new Error(`Account with id ${action.input.id} not found`);
        }
        account.KycAmlStatus = action.input.KycAmlStatus || "PENDING";
    }
};
