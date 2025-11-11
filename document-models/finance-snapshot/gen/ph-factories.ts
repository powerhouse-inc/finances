/**
 * Factory methods for creating FinanceSnapshotDocument instances
 */
import type { PHAuthState, PHDocumentState, PHBaseState } from "document-model";
import { createBaseState, defaultBaseState } from "document-model/core";
import type {
  FinanceSnapshotDocument,
  FinanceSnapshotLocalState,
  FinanceSnapshotGlobalState,
  FinanceSnapshotPHState,
} from "./types.js";
import { createDocument } from "./utils.js";

export function defaultGlobalState(): FinanceSnapshotGlobalState {
  return {
    id: "",
    name: "",
    period: "",
    periodStart: "",
    periodEnd: "",
    owner: "",
    created: "",
    wallets: [],
    transactions: [],
    balances: [],
  };
}

export function defaultLocalState(): FinanceSnapshotLocalState {
  return {};
}

export function defaultPHState(): FinanceSnapshotPHState {
  return {
    ...defaultBaseState(),
    global: defaultGlobalState(),
    local: defaultLocalState(),
  };
}

export function createGlobalState(
  state?: Partial<FinanceSnapshotGlobalState>,
): FinanceSnapshotGlobalState {
  return {
    ...defaultGlobalState(),
    ...(state || {}),
  } as FinanceSnapshotGlobalState;
}

export function createLocalState(
  state?: Partial<FinanceSnapshotLocalState>,
): FinanceSnapshotLocalState {
  return {
    ...defaultLocalState(),
    ...(state || {}),
  } as FinanceSnapshotLocalState;
}

export function createState(
  baseState?: Partial<PHBaseState>,
  globalState?: Partial<FinanceSnapshotGlobalState>,
  localState?: Partial<FinanceSnapshotLocalState>,
): FinanceSnapshotPHState {
  return {
    ...createBaseState(baseState?.auth, baseState?.document),
    global: createGlobalState(globalState),
    local: createLocalState(localState),
  };
}

/**
 * Creates a FinanceSnapshotDocument with custom global and local state
 * This properly handles the PHBaseState requirements while allowing
 * document-specific state to be set.
 */
export function createFinanceSnapshotDocument(
  state?: Partial<{
    auth?: Partial<PHAuthState>;
    document?: Partial<PHDocumentState>;
    global?: Partial<FinanceSnapshotGlobalState>;
    local?: Partial<FinanceSnapshotLocalState>;
  }>,
): FinanceSnapshotDocument {
  const document = createDocument(
    state
      ? createState(
          createBaseState(state.auth, state.document),
          state.global,
          state.local,
        )
      : undefined,
  );

  return document;
}
