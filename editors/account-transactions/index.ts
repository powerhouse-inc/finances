import { EditorModule } from "document-model";
import Editor from "./editor";
import { AccountTransactionsDocument } from "../../document-models/account-transactions";

export const module: EditorModule<AccountTransactionsDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/account-transactions"],
  config: {
    id: "editor-id",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
