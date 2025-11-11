import type { DocumentModelUtils } from "document-model";
import {
  baseCreateDocument,
  baseSaveToFileHandle,
  baseLoadFromInput,
  defaultBaseState,
  generateId,
} from "document-model/core";
import type {
  FinanceSnapshotGlobalState,
  FinanceSnapshotLocalState,
} from "./types.js";
import type { FinanceSnapshotPHState } from "./types.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: FinanceSnapshotGlobalState = {
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
export const initialLocalState: FinanceSnapshotLocalState = {};

const utils: DocumentModelUtils<FinanceSnapshotPHState> = {
  fileExtension: ".phdm",
  createState(state) {
    return {
      ...defaultBaseState(),
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createDocument(state) {
    const document = baseCreateDocument(utils.createState, state);

    document.header.documentType = "powerhouse/finance-snapshot";

    // for backwards compatibility, but this is NOT a valid signed document id
    document.header.id = generateId();

    return document;
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
};

export const createDocument = utils.createDocument;
export const createState = utils.createState;
export const saveToFileHandle = utils.saveToFileHandle;
export const loadFromInput = utils.loadFromInput;

export default utils;
