/**
 * This is a scaffold file meant for customization.
 * Delete the file and run the code generator again to have it reset
 */

import {
  actions as BaseActions,
  type DocumentModelModule,
} from "document-model";
import { actions as AccountTransactionsActions } from "./gen/index.js";
import { reducer } from "./gen/reducer.js";
import { documentModel } from "./gen/document-model.js";
import genUtils from "./gen/utils.js";
import * as customUtils from "./src/utils.js";
import { type AccountTransactionsDocument } from "./gen/types.js";

const utils = { ...genUtils, ...customUtils };
const actions = { ...BaseActions, ...AccountTransactionsActions };

export const module: DocumentModelModule<AccountTransactionsDocument> = {
  reducer,
  actions,
  utils,
  documentModel,
};

export { reducer, actions, utils, documentModel };

export * from "./gen/types.js";
export * from "./src/utils.js";
