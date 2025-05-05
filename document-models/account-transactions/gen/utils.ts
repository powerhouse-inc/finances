import {
  type DocumentModelUtils,
  baseCreateDocument,
  baseCreateExtendedState,
  baseSaveToFile,
  baseSaveToFileHandle,
  baseLoadFromFile,
  baseLoadFromInput,
} from "document-model";
import {
  type AccountTransactionsDocument,
  type AccountTransactionsState,
  type AccountTransactionsLocalState,
} from "./types.js";
import { reducer } from "./reducer.js";

export const initialGlobalState: AccountTransactionsState = {
  account: {
    id: "",
    username: "",
    type: "CONTRIBUTOR",
    icon: "",
  },
  transactions: [],
  budgets: [],
};
export const initialLocalState: AccountTransactionsLocalState = {};

const utils: DocumentModelUtils<AccountTransactionsDocument> = {
  fileExtension: ".phdm",
  createState(state) {
    return {
      global: { ...initialGlobalState, ...state?.global },
      local: { ...initialLocalState, ...state?.local },
    };
  },
  createExtendedState(extendedState) {
    return baseCreateExtendedState(
      { ...extendedState, documentType: "powerhouse/account-transactions" },
      utils.createState,
    );
  },
  createDocument(state) {
    return baseCreateDocument(
      utils.createExtendedState(state),
      utils.createState,
    );
  },
  saveToFile(document, path, name) {
    return baseSaveToFile(document, path, ".phdm", name);
  },
  saveToFileHandle(document, input) {
    return baseSaveToFileHandle(document, input);
  },
  loadFromFile(path) {
    return baseLoadFromFile(path, reducer);
  },
  loadFromInput(input) {
    return baseLoadFromInput(input, reducer);
  },
};

export default utils;
