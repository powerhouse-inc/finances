import { type EditorModule } from "document-model";
import Editor from "./editor.js";
import { type DocumentDriveDocument } from "document-drive";

export const module: EditorModule<DocumentDriveDocument> = {
  Component: Editor,
  documentTypes: ["powerhouse/document-drive"],
  config: {
    id: "FinancesDriveExplorer",
    disableExternalControls: true,
    documentToolbarEnabled: true,
    showSwitchboardLink: true,
  },
};

export default module;
