import type { PHDocument, ExtendedState } from "document-model";
import type { AccountsState } from "./schema/types.js";
import type { AccountsAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type AccountsLocalState = Record<PropertyKey, never>;
export type ExtendedAccountsState = ExtendedState<
  AccountsState,
  AccountsLocalState
>;
export type AccountsDocument = PHDocument<
  AccountsState,
  AccountsLocalState,
  AccountsAction
>;
export type { AccountsState, AccountsLocalState, AccountsAction };
