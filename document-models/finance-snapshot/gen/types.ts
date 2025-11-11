import type { PHDocument, PHBaseState } from "document-model";
import type { FinanceSnapshotAction } from "./actions.js";
import type { FinanceSnapshotState as FinanceSnapshotGlobalState } from "./schema/types.js";

export { z } from "./schema/index.js";
export * from "./schema/types.js";
type FinanceSnapshotLocalState = Record<PropertyKey, never>;
type FinanceSnapshotPHState = PHBaseState & {
  global: FinanceSnapshotGlobalState;
  local: FinanceSnapshotLocalState;
};
type FinanceSnapshotDocument = PHDocument<FinanceSnapshotPHState>;

export type {
  FinanceSnapshotGlobalState,
  FinanceSnapshotLocalState,
  FinanceSnapshotPHState,
  FinanceSnapshotAction,
  FinanceSnapshotDocument,
};
