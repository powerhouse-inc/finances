import type { EditorModule } from "document-model";
import Editor from "./editor.js";
import type { AccountTransactionsDocument } from "../../document-models/account-transactions/index.js";

export const module: EditorModule<AccountTransactionsDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/account-transactions"],
  config: {
    id: "account-transactions-editor",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
