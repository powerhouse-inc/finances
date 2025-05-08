import type { PHDocument, ExtendedState } from "document-model";
import type { AccountTransactionsState } from "./schema/types.js";
import type { AccountTransactionsAction } from "./actions.js";

export { z } from "./schema/index.js";
export type * from "./schema/types.js";
type AccountTransactionsLocalState = Record<PropertyKey, never>;
export type ExtendedAccountTransactionsState = ExtendedState<
  AccountTransactionsState,
  AccountTransactionsLocalState
>;
export type AccountTransactionsDocument = PHDocument<
  AccountTransactionsState,
  AccountTransactionsLocalState,
  AccountTransactionsAction
>;
export type {
  AccountTransactionsState,
  AccountTransactionsLocalState,
  AccountTransactionsAction,
};
