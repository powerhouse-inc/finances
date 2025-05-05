import { createAction } from "document-model";
import {
  z,
  type CreateAccountInput,
  type UpdateAccountInput,
  type DeleteAccountInput,
} from "../types.js";
import {
  type CreateAccountAction,
  type UpdateAccountAction,
  type DeleteAccountAction,
} from "./actions.js";

export const createAccount = (input: CreateAccountInput) =>
  createAction<CreateAccountAction>(
    "CREATE_ACCOUNT",
    { ...input },
    undefined,
    z.CreateAccountInputSchema,
    "global",
  );

export const updateAccount = (input: UpdateAccountInput) =>
  createAction<UpdateAccountAction>(
    "UPDATE_ACCOUNT",
    { ...input },
    undefined,
    z.UpdateAccountInputSchema,
    "global",
  );

export const deleteAccount = (input: DeleteAccountInput) =>
  createAction<DeleteAccountAction>(
    "DELETE_ACCOUNT",
    { ...input },
    undefined,
    z.DeleteAccountInputSchema,
    "global",
  );
