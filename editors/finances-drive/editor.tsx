import { type DriveEditorProps } from "@powerhousedao/reactor-browser";
import { DriveContextProvider } from "@powerhousedao/reactor-browser/hooks/useDriveContext";
import {
  type DocumentDriveDocument,
  addFolder,
  deleteNode,
  updateNode,
  generateNodesCopy,
  copyNode,
} from "document-drive";
import { WagmiContext } from "@powerhousedao/design-system";
import { DriveExplorer } from "./components/DriveExplorer.js";
import { useCallback } from "react";
import { hashKey } from "document-model";

export type IProps = DriveEditorProps<DocumentDriveDocument>;

export function BaseEditor(props: IProps) {
  const { dispatch, context } = props;

  const onAddFolder = useCallback(
    (name: string, parentFolder?: string) => {
      dispatch(
        addFolder({
          id: hashKey(),
          name,
          parentFolder,
        }),
      );
    },
    [dispatch],
  );

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      dispatch(deleteNode({ id: nodeId }));
    },
    [dispatch],
  );

  const renameNode = useCallback(
    (nodeId: string, name: string) => {
      dispatch(updateNode({ id: nodeId, name }));
    },
    [dispatch],
  );

  const onCopyNode = useCallback(
    (nodeId: string, targetName: string, parentId?: string) => {
      const generateId = () => hashKey();

      const copyNodesInput = generateNodesCopy(
        {
          srcId: nodeId,
          targetParentFolder: parentId,
          targetName,
        },
        generateId,
        props.document.state.global.nodes,
      );

      const copyNodesAction = copyNodesInput.map((input) => {
        return copyNode(input);
      });

      for (const copyNodeAction of copyNodesAction) {
        dispatch(copyNodeAction);
      }
    },
    [dispatch, props.document.state.global.nodes],
  );

  return (
    <div className="new-drive-explorer" style={{ height: "100%" }}>
      <DriveExplorer
        driveId={props.document.state.global.id}
        nodes={props.document.state.global.nodes}
        onAddFolder={onAddFolder}
        onDeleteNode={onDeleteNode}
        renameNode={renameNode}
        onCopyNode={onCopyNode}
        context={context}
      />
    </div>
  );
}

export default function Editor(props: IProps) {
  return (
    <DriveContextProvider value={props.context}>
      <WagmiContext>
        <BaseEditor {...props} />
      </WagmiContext>
    </DriveContextProvider>
  );
}
