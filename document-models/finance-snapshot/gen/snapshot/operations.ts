import { type SignalDispatch } from "document-model";
import {
  type CreateSnapshotAction,
  type AddWalletAction,
  type RemoveWalletAction,
  type UpdatePeriodAction,
  type RefreshSnapshotDataAction,
} from "./actions.js";
import { type FinanceSnapshotState } from "../types.js";

export interface FinanceSnapshotSnapshotOperations {
  createSnapshotOperation: (
    state: FinanceSnapshotState,
    action: CreateSnapshotAction,
    dispatch?: SignalDispatch,
  ) => void;
  addWalletOperation: (
    state: FinanceSnapshotState,
    action: AddWalletAction,
    dispatch?: SignalDispatch,
  ) => void;
  removeWalletOperation: (
    state: FinanceSnapshotState,
    action: RemoveWalletAction,
    dispatch?: SignalDispatch,
  ) => void;
  updatePeriodOperation: (
    state: FinanceSnapshotState,
    action: UpdatePeriodAction,
    dispatch?: SignalDispatch,
  ) => void;
  refreshSnapshotDataOperation: (
    state: FinanceSnapshotState,
    action: RefreshSnapshotDataAction,
    dispatch?: SignalDispatch,
  ) => void;
}
