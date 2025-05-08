import type { EditorModule } from "document-model";
import Editor from "./editor.js";
import type { AccountsDocument } from "../../document-models/accounts/index.js";

export const module: EditorModule<AccountsDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/accounts"],
  config: {
    id: "accounts-editor",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
