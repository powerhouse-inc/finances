import { type EditorProps } from "document-model";
import { EditorLayout } from "./components/editor-layout.js";
import { type DocumentDriveDocument } from "document-drive";
import { WagmiContext } from "@powerhousedao/design-system";
import {
  DriveContextProvider,
  type SyncStatus,
} from "@powerhousedao/reactor-browser";
import { documentModels } from "../../index.js";
import { type DocumentModelModule, type PHDocument } from "document-model";
import { type FileNode } from "document-drive";

export type IProps = EditorProps<DocumentDriveDocument>;

export default function Editor(props: IProps) {
  // Add debugging logs
  // console.log("DriveExplorer props:", props);
  // console.log("DriveExplorer document:", props.document);
  // console.log("DriveExplorer context:", props.context);

  console.log('props.document.state.global.nodes', props.document.state.global.nodes)
  return (
    <div className="finances-drive-explorer" style={{ height: "100%" }}>
      <EditorLayout
        context={props.context}
        driveId={props.document.state.global.id}
        nodes={props.document.state.global.nodes}
      >
        <style>
          {`
                .finances-drive-explorer-header {
                  margin-bottom: 1em;
                }
                .finances-drive-explorer > main {
                  border: 1px solid #EEEEEE;
                }
                
                .d-none {
                  display: none;
                }
                #document-editor-context > div.flex:first-child {
                  position: absolute;
                  right: 0;
                  top: 16px;
                }`}
        </style>
      </EditorLayout>
    </div>
  );
}
