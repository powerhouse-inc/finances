import { type ReactorClient } from "./ReactorClient.js";
import { type DocumentsCache, DocumentCacheEntry } from "./DocumentsCache.js";
import { gql } from "graphql-request";
import { type Maybe } from "document-model";

const DEFAULT_MAX_QUERY_BATCH_SIZE = 5;

export type GqlResult<StateType> = {
  document: {
    id: string;
    name: string;
    revision: number;
    state: StateType;
  };
};

export abstract class DocumentClient<StateType, InputType> {
  private documentType: string;
  private maxQueryBatchSize: number = DEFAULT_MAX_QUERY_BATCH_SIZE;
  protected readClient: ReactorClient;
  protected documentsCache: DocumentsCache;
  private documentSchema?: string;

  constructor(
    documentType: string,
    documentsCache: DocumentsCache,
    readClient: ReactorClient,
  ) {
    this.documentType = documentType;
    this.readClient = readClient;
    this.documentsCache = documentsCache;
  }

  protected async setDocumentSchema(schema: string) {
    this.documentSchema = schema;
  }

  protected async getDocumentData(id: string) {
    if (!this.documentSchema) {
      throw new Error(
        `Cannot get document data: document schema for ${this.documentType} not set.`,
      );
    }

    return this.readClient.queryReactor<GqlResult<StateType>>(
      gql`
          query getDocument($id: String!) {
            document(id: $id) {
              ... on ${this.documentSchema}
            }
          }
        `,
      { id },
    );
  }

  public async loadDriveDocumentCache() {
    const driveDocuments = Object.values(
      this.documentsCache.getDocumentsOfType(this.documentType),
    );
    console.log(
      ` > Loading cache for ${driveDocuments.length} ${this.documentType} document(s)...`,
    );

    for (let i = 0; i < driveDocuments.length; ) {
      const batchSize = Math.min(
        this.maxQueryBatchSize,
        driveDocuments.length - i,
      );
      const data = await Promise.all(
        driveDocuments
          .slice(i, i + batchSize)
          .map((d) => this.getDocumentData(d.id)),
      );

      data.forEach((d) =>
        this.documentsCache.updateDocument({
          id: d.document.id,
          documentType: this.documentType,
          inputId: this.getInputIdFromState(d.document.state),
          name: this.getNameFromState(d.document.state) || undefined,
          state:
            typeof d.document.state === "object"
              ? (d.document.state as object)
              : undefined,
        }),
      );

      i += batchSize;
    }
  }

  public async update(inputDocument: InputType) {
    const inputId = this.getInputIdFromInput(inputDocument);
    if (!inputId) {
      throw new Error(
        `Cannot update input document without ID: ${JSON.stringify(inputDocument)}`,
      );
    }

    const documentIds = this.documentsCache.resolveInputId(inputId);
    let newDocumentId: string | null = null;

    if (documentIds.length > 0) {
      console.log(
        `Updating ${documentIds.length} existing document(s) for "${this.getNameFromInput(inputDocument)}"...`,
      );
    } else {
      newDocumentId = await this.createDocumentFromInput(inputDocument);

      documentIds.push(newDocumentId);
      this.documentsCache.createDocument({
        id: newDocumentId,
        documentType: this.documentType,
        inputId: this.getInputIdFromInput(inputDocument),
      });

      console.log(
        `Creating new document for "${this.getNameFromInput(inputDocument)}"...`,
      );
    }

    for (const documentId of documentIds) {
      const currentState = await this.loadDocumentState(
        this.documentType,
        documentId,
      );

      const targetState = this.getTargetState(inputDocument, currentState);

      await this.patchDocumentState(
        documentId,
        currentState,
        targetState,
        inputDocument,
      );

      this.documentsCache.updateDocument({
        id: documentId,
        documentType: this.documentType,
        inputId: this.getInputIdFromInput(inputDocument),
        name: this.getNameFromState(targetState) || undefined,
        state: targetState as object,
      });
    }

    return newDocumentId;
  }

  public async loadDocument(
    documentType: string,
    id: string,
    skipCache = false,
    requireState = true,
  ) {
    if (
      skipCache ||
      !this.documentsCache.hasDocument(documentType, id, requireState)
    ) {
      const data = await this.getDocumentData(id);

      if (requireState && this.documentsCache.hasDocument(documentType, id)) {
        this.documentsCache.updateDocument({
          ...this.documentsCache.getDocumentCacheEntry(documentType, id),
          state:
            typeof data.document.state === "object"
              ? (data.document.state as object)
              : undefined,
        });
      } else {
        this.documentsCache.createDocument({
          documentType,
          id,
          inputId: this.getInputIdFromState(data.document.state),
          name: this.getNameFromState(data.document.state) || undefined,
          state:
            typeof data.document.state === "object"
              ? (data.document.state as object)
              : undefined,
        });
      }
    }

    return this.documentsCache.getDocumentCacheEntry(documentType, id);
  }

  public async loadDocumentState(
    documentType: string,
    id: string,
    skipCache = false,
  ) {
    const document = await this.loadDocument(documentType, id, skipCache, true);
    return document.state as StateType;
  }

  protected abstract getInputIdFromState(state: StateType): Maybe<string>;
  protected abstract getNameFromState(state: StateType): Maybe<string>;
  protected abstract getInputIdFromInput(input: InputType): Maybe<string>;
  protected abstract getNameFromInput(input: InputType): Maybe<string>;
  protected abstract createDocumentFromInput(input: InputType): Promise<string>;
  protected abstract getTargetState(
    input: InputType,
    current: StateType,
  ): StateType;
  protected abstract patchDocumentState(
    id: string,
    current: StateType,
    target: StateType,
    input: InputType,
  ): Promise<boolean>;
}
