import type { EditorModule } from "document-model";
import { Editor } from "./editor.js";

export const module: EditorModule = {
  Component: Editor,
  documentTypes: ["powerhouse/finance-snapshot"],
  config: {
    id: "finance-snapshot-editor",
    name: "finance-snapshot-editor",
  },
};
