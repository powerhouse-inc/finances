import { type Action } from "document-model";
import type {
  CreateSnapshotInput,
  AddWalletInput,
  RemoveWalletInput,
  UpdatePeriodInput,
  RefreshSnapshotDataInput,
} from "../types.js";

export type CreateSnapshotAction = Action & {
  type: "CREATE_SNAPSHOT";
  input: CreateSnapshotInput;
};
export type AddWalletAction = Action & {
  type: "ADD_WALLET";
  input: AddWalletInput;
};
export type RemoveWalletAction = Action & {
  type: "REMOVE_WALLET";
  input: RemoveWalletInput;
};
export type UpdatePeriodAction = Action & {
  type: "UPDATE_PERIOD";
  input: UpdatePeriodInput;
};
export type RefreshSnapshotDataAction = Action & {
  type: "REFRESH_SNAPSHOT_DATA";
  input: RefreshSnapshotDataInput;
};

export type FinanceSnapshotSnapshotAction =
  | CreateSnapshotAction
  | AddWalletAction
  | RemoveWalletAction
  | UpdatePeriodAction
  | RefreshSnapshotDataAction;
