import {
  useDocumentOfType,
  useSelectedDocumentOfType,
} from "@powerhousedao/reactor-browser";
import type {
  AccountsAction,
  AccountsDocument,
} from "../../document-models/accounts/index.js";

export function useAccountsDocument(documentId: string | null | undefined) {
  return useDocumentOfType<AccountsDocument, AccountsAction>(
    documentId,
    "powerhouse/accounts",
  );
}

export function useSelectedAccountsDocument() {
  return useSelectedDocumentOfType<AccountsDocument, AccountsAction>(
    "powerhouse/accounts",
  );
}
