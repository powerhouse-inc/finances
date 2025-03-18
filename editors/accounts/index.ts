import { EditorModule } from "document-model";
import Editor from "./editor";
import { AccountsDocument } from "../../document-models/accounts";

export const module: EditorModule<AccountsDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/accounts"],
  config: {
    id: "editor-id",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
