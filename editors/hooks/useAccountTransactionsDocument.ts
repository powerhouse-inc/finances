import {
  useDocumentOfType,
  useSelectedDocumentOfType,
} from "@powerhousedao/reactor-browser";
import type {
  AccountTransactionsAction,
  AccountTransactionsDocument,
} from "../../document-models/account-transactions/index.js";

export function useAccountTransactionsDocument(
  documentId: string | null | undefined,
) {
  return useDocumentOfType<
    AccountTransactionsDocument,
    AccountTransactionsAction
  >(documentId, "powerhouse/account-transactions");
}

export function useSelectedAccountTransactionsDocument() {
  return useSelectedDocumentOfType<
    AccountTransactionsDocument,
    AccountTransactionsAction
  >("powerhouse/account-transactions");
}
