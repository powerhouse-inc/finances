import { useCallback, useState, useRef, useMemo } from "react";
import { useDriveContext } from "@powerhousedao/reactor-browser";
import { EditorContainer } from "./editor-container.js";
import { type DocumentModelModule, type EditorContext } from "document-model";
import { CreateDocumentModal } from "@powerhousedao/design-system";
import { CreateDocument } from "./create-document.js";
import type { Node } from "document-drive";

export interface EditorLayoutProps {
  readonly driveId: string;
  readonly children: React.ReactNode;
  readonly context: EditorContext;
  readonly nodes: Node[];
}

export function EditorLayout({
  children,
  driveId,
  context,
  nodes: driveNodes,
}: EditorLayoutProps) {
  const { useDriveDocumentStates, addDocument, documentModels } =
    useDriveContext();

  // Add debugging
  console.log("EditorLayout - driveId:", driveId);
  console.log("EditorLayout - context:", context);
  console.log("EditorLayout - documentModels:", documentModels);
  console.log("EditorLayout - useDriveContext:", useDriveContext());

  const [activeNodeId, setActiveNodeId] = useState<string | undefined>();
  const [openModal, setOpenModal] = useState(false);
  const selectedDocumentModel = useRef<DocumentModelModule | null>(null);

  const [state, fetchDocuments] = useDriveDocumentStates({ driveId });

  const onEditorClose = useCallback(() => {
    setActiveNodeId(undefined);
  }, []);

  const onCreateDocument = useCallback(
    async (fileName: string) => {
      setOpenModal(false);

      const documentModel = selectedDocumentModel.current;
      if (!documentModel) return;

      const node = await addDocument(
        driveId,
        fileName,
        documentModel.documentModel.id,
      );

      selectedDocumentModel.current = null;
      await fetchDocuments(driveId, [node.id]);
      setActiveNodeId(node.id);
    },
    [addDocument, driveId, setActiveNodeId],
  );

  const onSelectDocumentModel = (documentModel: DocumentModelModule) => {
    selectedDocumentModel.current = documentModel;
    setOpenModal(true);
  };

  const filteredDocumentModels = documentModels.filter(
    (docModel) => docModel.documentModel.id !== "powerhouse/document-model",
  );

  console.log("EditorLayout - filteredDocumentModels:", filteredDocumentModels);

  return (
    <main className="flex overflow-hidden h-full">
      <div className="flex-1 bg-gray-50 p-4 dark:bg-slate-800">
        <>
          {activeNodeId && (
            <EditorContainer
              context={context}
              documentId={activeNodeId}
              documentType={state[activeNodeId].documentType}
              driveId={driveId}
              key={activeNodeId}
              onClose={onEditorClose}
              title={"Financial Documents"}
            />
          )}
          <h1 className="text-xl font-bold mb-4">Finances Explorer</h1>
          <p className="mb-4">Welcome to your financial documents drive.</p>
          <CreateDocument
            /* @ts-expect-error */
            createDocument={onSelectDocumentModel}
            documentModels={filteredDocumentModels}
          />
          {children}
          <CreateDocumentModal
            onContinue={onCreateDocument}
            onOpenChange={(open) => setOpenModal(open)}
            open={openModal}
          />
        </>
      </div>
    </main>
  );
}
