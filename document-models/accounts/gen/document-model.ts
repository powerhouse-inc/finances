import type { DocumentModelState } from "document-model";

export const documentModel: DocumentModelState = {
  id: "powerhouse/accounts",
  name: "Accounts",
  extension: ".phdm",
  description:
    "The Accounts model manages a collection of financial accounts within the system. Each account entry encapsulates essential information such as the account's identity, type, associated budget path, and related account details. ",
  author: {
    name: "Teep",
    website: "",
  },
  specifications: [
    {
      version: 1,
      changeLog: [],
      state: {
        global: {
          schema:
            "type AccountsState {\n    accounts: [ AccountEntry! ]!\n}\n\ntype AccountEntry {\n\t\tid: OID!\n\t\tname: OLabel  \n\t\taccountTransactionsId: PHID\n\t\tchain: String\n\t\taccount: EthereumAddress\n\t\tbudgetPath: String\n\t\ttype: AccountType\n\t\towners: [PHID]\n}\n\nenum AccountType {\n\tProtocol\n\tAuditor\n\tOperational\n\tPayment Processor\n}",
          initialValue: '"{\\n  \\"accounts\\": []\\n}"',
          examples: [],
        },
        local: {
          schema: "",
          initialValue: '""',
          examples: [],
        },
      },
      modules: [
        {
          id: "kVJVlAVQysUOwTyQKGYMvTQLx9o=",
          name: "accounts",
          description: "",
          operations: [
            {
              id: "exjRXJOmtYfjW/lY86kkdV77D38=",
              name: "CREATE_ACCOUNT",
              description: "Adds a new account to the accounts state.",
              schema:
                "input CreateAccountInput {\n    id: OID!\n\tname: OLabel  \t\t\n    accountTransactionsId: PHID\n\tchain: String\n\taccount: EthereumAddress\n\tbudgetPath: String\n\ttype: AccountType\n\towners: [PHID]\n}\n\nenum AccountType {\n\tProtocol\n\tAuditor\n\tOperational\n\tPayment Processor\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "k89uw03p6AfiVUqNoJ0iWPnry2s=",
              name: "UPDATE_ACCOUNT",
              description: "Updates an existing account in the accounts state.",
              schema:
                "input UpdateAccountInput {\n    id: OID!\n    name: OLabel  \n    accountTransactionsId: PHID\n    chain: String\n    account: EthereumAddress\n    budgetPath: String\n    type: AccountType\n    owners: [PHID]\n}\n\nenum AccountType {\n\tProtocol\n\tAuditor\n\tOperational\n\tPayment Processor\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
            {
              id: "m4uUdA5Iuq+WrUyIpy8pyrdur+E=",
              name: "DELETE_ACCOUNT",
              description: "",
              schema: "input DeleteAccountInput {\n  id: ID!\n}",
              template: "",
              reducer: "",
              errors: [],
              examples: [],
              scope: "global",
            },
          ],
        },
      ],
    },
  ],
};
