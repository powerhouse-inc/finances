import {
  useDriveContext,
  exportDocument,
  type User,
} from "@powerhousedao/reactor-browser";
import {
  type DocumentModelModule,
  type EditorContext,
  type EditorProps,
  type PHDocument,
} from "document-model";
import {
  DocumentToolbar,
  RevisionHistory,
  DefaultEditorLoader,
} from "@powerhousedao/design-system";
import { useState, Suspense, type FC, useCallback, lazy, useEffect } from "react";

import {
  Accounts,
  AccountTransactions,
} from "../../../document-models/index.js";

export interface EditorContainerProps {
  driveId: string;
  documentId: string;
  documentType: string;
  onClose: () => void;
  title: string;
  context: EditorContext;
}

const documentModelsMap = {
  [Accounts.documentModel.id]: Accounts,
  [AccountTransactions.documentModel.id]: AccountTransactions,
};

const documentEditorMap2 = {
  [Accounts.documentModel.id]: lazy(() =>
    import("../../accounts/index.js").then((m) => ({
      default: m.default.Component,
    })),
  ),
  [AccountTransactions.documentModel.id]: lazy(() =>
    import("../../account-transactions/index.js").then((m) => ({
      default: m.default.Component,
    })),
  ),
} as const;

function getDocumentModel(documentType: string) {
  return documentModelsMap[documentType as any];
}

function getDocumentEditor(documentType: string) {
  return documentEditorMap2[documentType as any];
}

export const EditorContainer: React.FC<EditorContainerProps> = (props) => {
  const { driveId, documentId, documentType, onClose, title, context } = props;

  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const { useDocumentEditorProps } = useDriveContext();
  const user = context.user as User | undefined;

  const documentModelModule = getDocumentModel(
    documentType,
  ) as DocumentModelModule<PHDocument>;

  const { dispatch, error, document } = useDocumentEditorProps({
    documentId,
    documentType,
    driveId,
    documentModelModule,
    user,
  });

  const [updatedDocument, setUpdatedDocument] = useState({ ...document, documentId, driveId });

  useEffect(() => {
    setUpdatedDocument({ ...document, documentId, driveId });
  }, [document, documentId, driveId]);

  const onExport = useCallback(async () => {
    if (document) {
      const ext = documentModelModule.documentModel.extension;
      await exportDocument(document, title, ext);
    }
  }, [document?.revision.global, document?.revision.local]);

  const loadingContent = (
    <div className="flex-1 flex justify-center items-center h-full">
      <DefaultEditorLoader />
    </div>
  );

  if (!document) return loadingContent;

  const Editor = getDocumentEditor(documentType);

  if (!Editor) {
    console.error("No editor found for document type:", documentType);
    return (
      <div className="flex-1">
        No editor found for document type: {documentType}
      </div>
    );
  }
  const EditorComponent = Editor as FC<EditorProps<PHDocument>>;

  return showRevisionHistory ? (
    <RevisionHistory
      documentId={documentId}
      documentTitle={title}
      globalOperations={document.operations.global}
      key={documentId}
      localOperations={document.operations.local}
      onClose={() => setShowRevisionHistory(false)}
    />
  ) : (
    <Suspense fallback={loadingContent}>
      <DocumentToolbar
        onClose={onClose}
        onExport={onExport}
        onShowRevisionHistory={() => setShowRevisionHistory(true)}
        onSwitchboardLinkClick={() => {}}
        title={title}
      />
      <EditorComponent
        context={context}
        dispatch={dispatch}
        document={updatedDocument as unknown as PHDocument}
        error={error}
      />
    </Suspense>
  );
};
