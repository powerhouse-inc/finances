import { createAction } from "document-model/core";
import { z, type AddTransactionInput } from "../types.js";
import { type AddTransactionAction } from "./actions.js";

export const addTransaction = (input: AddTransactionInput) =>
  createAction<AddTransactionAction>(
    "ADD_TRANSACTION",
    { ...input },
    undefined,
    z.AddTransactionInputSchema,
    "global",
  );
