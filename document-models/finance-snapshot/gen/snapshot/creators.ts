import { createAction } from "document-model/core";
import {
  z,
  type CreateSnapshotInput,
  type AddWalletInput,
  type RemoveWalletInput,
  type UpdatePeriodInput,
  type RefreshSnapshotDataInput,
} from "../types.js";
import {
  type CreateSnapshotAction,
  type AddWalletAction,
  type RemoveWalletAction,
  type UpdatePeriodAction,
  type RefreshSnapshotDataAction,
} from "./actions.js";

export const createSnapshot = (input: CreateSnapshotInput) =>
  createAction<CreateSnapshotAction>(
    "CREATE_SNAPSHOT",
    { ...input },
    undefined,
    z.CreateSnapshotInputSchema,
    "global",
  );

export const addWallet = (input: AddWalletInput) =>
  createAction<AddWalletAction>(
    "ADD_WALLET",
    { ...input },
    undefined,
    z.AddWalletInputSchema,
    "global",
  );

export const removeWallet = (input: RemoveWalletInput) =>
  createAction<RemoveWalletAction>(
    "REMOVE_WALLET",
    { ...input },
    undefined,
    z.RemoveWalletInputSchema,
    "global",
  );

export const updatePeriod = (input: UpdatePeriodInput) =>
  createAction<UpdatePeriodAction>(
    "UPDATE_PERIOD",
    { ...input },
    undefined,
    z.UpdatePeriodInputSchema,
    "global",
  );

export const refreshSnapshotData = (input: RefreshSnapshotDataInput) =>
  createAction<RefreshSnapshotDataAction>(
    "REFRESH_SNAPSHOT_DATA",
    { ...input },
    undefined,
    z.RefreshSnapshotDataInputSchema,
    "global",
  );
