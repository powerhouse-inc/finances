import { useState } from "react";
import { DocumentToolbar } from "@powerhousedao/design-system";
import { Button } from "@powerhousedao/document-engineering";
import {
  setSelectedNode,
  useParentFolderForSelectedNode,
} from "@powerhousedao/reactor-browser";
import { generateId } from "document-model/core";
import { setName } from "document-model";
import { useSelectedAccountsDocument } from "../hooks/useAccountsDocument.js";
import {
  addAccount,
  updateAccount,
  deleteAccount,
  updateKycStatus,
} from "../../document-models/accounts/gen/accounts/creators.js";
import type {
  AccountEntry,
  AccountTypeInput,
  KycAmlStatusTypeInput,
} from "../../document-models/accounts/gen/schema/types.js";
import { AccountCard } from "./components/AccountCard.js";
import { AccountForm } from "./components/AccountForm.js";
import { DocumentHeader } from "./components/DocumentHeader.js";

type ViewMode = "list" | "add" | "edit";

export function Editor() {
  const [document, dispatch] = useSelectedAccountsDocument();
  const parentFolder = useParentFolderForSelectedNode();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [editingAccount, setEditingAccount] = useState<AccountEntry | null>(
    null,
  );

  function handleClose() {
    setSelectedNode(parentFolder?.id);
  }

  function handleAddAccount(values: {
    account: string;
    name: string;
    budgetPath?: string;
    accountTransactionsId?: string;
    chain?: string[];
    type?: AccountTypeInput;
    owners?: string[];
    KycAmlStatus?: KycAmlStatusTypeInput;
  }) {
    dispatch(
      addAccount({
        id: generateId(),
        account: values.account,
        name: values.name,
        budgetPath: values.budgetPath,
        accountTransactionsId: values.accountTransactionsId,
        chain: values.chain,
        type: values.type,
        owners: values.owners,
        KycAmlStatus: values.KycAmlStatus,
      }),
    );
    setViewMode("list");
  }

  function handleUpdateAccount(values: {
    id?: string;
    account: string;
    name: string;
    budgetPath?: string;
    accountTransactionsId?: string;
    chain?: string[];
    type?: AccountTypeInput;
    owners?: string[];
    KycAmlStatus?: KycAmlStatusTypeInput;
  }) {
    if (!values.id) return;
    dispatch(
      updateAccount({
        id: values.id,
        account: values.account,
        name: values.name,
        budgetPath: values.budgetPath,
        accountTransactionsId: values.accountTransactionsId,
        chain: values.chain,
        type: values.type,
        owners: values.owners,
        KycAmlStatus: values.KycAmlStatus,
      }),
    );
    setViewMode("list");
    setEditingAccount(null);
  }

  function handleDeleteAccount(id: string) {
    if (window.confirm("Are you sure you want to delete this account?")) {
      dispatch(deleteAccount({ id }));
    }
  }

  function handleUpdateKycStatus(
    id: string,
    KycAmlStatus: KycAmlStatusTypeInput,
  ) {
    dispatch(updateKycStatus({ id, KycAmlStatus }));
  }

  function handleEditClick(account: AccountEntry) {
    setEditingAccount(account);
    setViewMode("edit");
  }

  function handleCancelForm() {
    setViewMode("list");
    setEditingAccount(null);
  }

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <DocumentToolbar document={document} onClose={handleClose} />

      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <DocumentHeader
            document={document}
            onNameChange={(name) => dispatch(setName(name))}
          />

          <div className="mt-8">
            {viewMode === "list" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      Accounts
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Manage your accounts with KYC/AML status tracking
                    </p>
                  </div>
                  <Button
                    onClick={() => setViewMode("add")}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                  >
                    Add Account
                  </Button>
                </div>

                {document.state.global.accounts.length === 0 ? (
                  <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900">
                      No accounts yet
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      Get started by creating your first account
                    </p>
                    <Button
                      onClick={() => setViewMode("add")}
                      className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium shadow-sm transition-colors"
                    >
                      Add Account
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {document.state.global.accounts.map((account) => (
                      <AccountCard
                        key={account.id}
                        account={account}
                        onEdit={handleEditClick}
                        onDelete={handleDeleteAccount}
                        onUpdateKycStatus={handleUpdateKycStatus}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {viewMode === "add" && (
              <div className="max-w-3xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Add New Account
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Fill in the account details below
                  </p>
                </div>
                <AccountForm
                  onSubmit={handleAddAccount}
                  onCancel={handleCancelForm}
                />
              </div>
            )}

            {viewMode === "edit" && editingAccount && (
              <div className="max-w-3xl">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Edit Account
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    Update the account details below
                  </p>
                </div>
                <AccountForm
                  account={editingAccount}
                  onSubmit={handleUpdateAccount}
                  onCancel={handleCancelForm}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
