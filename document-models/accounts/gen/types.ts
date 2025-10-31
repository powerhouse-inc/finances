import type { PHDocument, PHBaseState } from "document-model";
import type { AccountsAction } from "./actions.js";
import type { AccountsState as AccountsGlobalState } from "./schema/types.js";

export { z } from "./schema/index.js";
export * from "./schema/types.js";
type AccountsLocalState = Record<PropertyKey, never>;
type AccountsPHState = PHBaseState & {
  global: AccountsGlobalState;
  local: AccountsLocalState;
};
type AccountsDocument = PHDocument<AccountsPHState>;

export type {
  AccountsGlobalState,
  AccountsLocalState,
  AccountsPHState,
  AccountsAction,
  AccountsDocument,
};
