import { useState } from "react";
import { Button } from "@powerhousedao/document-engineering";
import type {
  AccountEntry,
  KycAmlStatusTypeInput,
} from "../../../document-models/accounts/gen/schema/types.js";
import { KYCStatusBadge } from "./KYCStatusBadge.js";

interface AccountCardProps {
  account: AccountEntry;
  onEdit: (account: AccountEntry) => void;
  onDelete: (id: string) => void;
  onUpdateKycStatus: (id: string, status: KycAmlStatusTypeInput) => void;
}

export function AccountCard({
  account,
  onEdit,
  onDelete,
  onUpdateKycStatus,
}: AccountCardProps) {
  const [showKycMenu, setShowKycMenu] = useState(false);

  const accountTypeColors = {
    Protocol: "bg-purple-100 text-purple-800",
    Auditor: "bg-blue-100 text-blue-800",
    Operational: "bg-green-100 text-green-800",
    PaymentProcessor: "bg-orange-100 text-orange-800",
  };

  function handleKycStatusChange(status: KycAmlStatusTypeInput) {
    onUpdateKycStatus(account.id, status);
    setShowKycMenu(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {account.name}
            </h3>
            <p className="text-sm text-gray-600 font-mono">{account.account}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(account)}
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit account"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
            <button
              onClick={() => onDelete(account.id)}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete account"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {account.type && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">Type:</span>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium ${accountTypeColors[account.type]}`}
              >
                {account.type}
              </span>
            </div>
          )}

          {account.budgetPath && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">
                Budget Path:
              </span>
              <span className="text-sm text-gray-900">{account.budgetPath}</span>
            </div>
          )}

          {account.accountTransactionsId && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-500">
                Transactions ID:
              </span>
              <span className="text-sm text-gray-900 font-mono">
                {account.accountTransactionsId}
              </span>
            </div>
          )}

          {account.chain && account.chain.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-500">Chains:</span>
              <div className="flex flex-wrap gap-1.5">
                {account.chain.map((chain, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {chain}
                  </span>
                ))}
              </div>
            </div>
          )}

          {account.owners && account.owners.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-sm font-medium text-gray-500">Owners:</span>
              <div className="flex flex-wrap gap-1.5">
                {account.owners.map((owner, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-700"
                  >
                    {owner}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">
                KYC/AML Status:
              </span>
              <div className="relative">
                <button
                  onClick={() => setShowKycMenu(!showKycMenu)}
                  className="hover:opacity-80 transition-opacity"
                  title="Update KYC/AML status"
                >
                  <KYCStatusBadge status={account.KycAmlStatus} />
                </button>
                {showKycMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowKycMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                      <div className="py-1">
                        <button
                          onClick={() => handleKycStatusChange("PASSED")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-900 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-green-500" />
                          Passed
                        </button>
                        <button
                          onClick={() => handleKycStatusChange("PENDING")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-900 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-yellow-500" />
                          Pending
                        </button>
                        <button
                          onClick={() => handleKycStatusChange("FAILED")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-900 flex items-center gap-2"
                        >
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          Failed
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
