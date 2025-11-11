import { createAction } from "document-model/core";
import { z, type UpdateWalletBalanceInput } from "../types.js";
import { type UpdateWalletBalanceAction } from "./actions.js";

export const updateWalletBalance = (input: UpdateWalletBalanceInput) =>
  createAction<UpdateWalletBalanceAction>(
    "UPDATE_WALLET_BALANCE",
    { ...input },
    undefined,
    z.UpdateWalletBalanceInputSchema,
    "global",
  );
