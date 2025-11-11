import { type Action } from "document-model";
import type { UpdateWalletBalanceInput } from "../types.js";

export type UpdateWalletBalanceAction = Action & {
  type: "UPDATE_WALLET_BALANCE";
  input: UpdateWalletBalanceInput;
};

export type FinanceSnapshotBalancesAction = UpdateWalletBalanceAction;
