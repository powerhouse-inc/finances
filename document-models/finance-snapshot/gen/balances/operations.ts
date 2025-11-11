import { type SignalDispatch } from "document-model";
import { type UpdateWalletBalanceAction } from "./actions.js";
import { type FinanceSnapshotState } from "../types.js";

export interface FinanceSnapshotBalancesOperations {
  updateWalletBalanceOperation: (
    state: FinanceSnapshotState,
    action: UpdateWalletBalanceAction,
    dispatch?: SignalDispatch,
  ) => void;
}
