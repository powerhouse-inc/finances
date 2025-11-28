/**
 * Service for creating Account Transactions documents and fetching transactions
 * Integrates with the existing GraphQL subgraph system
 */

import type { AccountEntry } from "../../../document-models/accounts/gen/schema/types.js";

export interface CreateAccountTransactionsResult {
  success: boolean;
  documentId?: string;
  transactionsAdded?: number;
  message: string;
}

export class AccountTransactionsService {
  private graphqlEndpoint: string;

  constructor() {
    // Use the same environment detection as other services
    this.graphqlEndpoint = this.getGraphQLEndpoint();
  }

  private getGraphQLEndpoint(): string {
    // Environment-aware endpoint selection
    if (typeof window !== 'undefined' && !window.document.baseURI.includes('localhost')) {
      return 'https://switchboard-dev.powerhouse.xyz/graphql';
    }
    return 'http://localhost:4001/graphql';
  }

  /**
   * Create an Account Transactions document and fetch transactions for the account
   */
  async createAccountTransactionsDocument(
    account: AccountEntry,
    driveId?: string
  ): Promise<CreateAccountTransactionsResult> {
    try {
      // Step 1: Create the Account Transactions document
      const documentName = `${account.name} Transactions`;
      const createResult = await this.createDocument(documentName, driveId);

      if (!createResult.success || !createResult.documentId) {
        throw new Error(createResult.message || "Failed to create document");
      }

      // Step 2: Set the account information in the document (skipped for now - setAccount mutation not implemented)

      // Step 3: Fetch and add transactions from Alchemy
      const transactionsResult = await this.fetchTransactionsFromAlchemy(
        createResult.documentId,
        account.account
      );

      // Step 4: Update the account with the transaction document ID
      if (transactionsResult.success) {
        await this.updateAccountTransactionsId(account.id, createResult.documentId);
      }

      return {
        success: true,
        documentId: createResult.documentId,
        transactionsAdded: transactionsResult.transactionsAdded || 0,
        message: `Successfully created document and fetched ${transactionsResult.transactionsAdded || 0} transactions`
      };

    } catch (error) {
      return {
        success: false,
        message: `Failed to create account transactions: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  /**
   * Create a new Account Transactions document
   */
  private async createDocument(name: string, driveId?: string): Promise<CreateAccountTransactionsResult> {
    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation CreateAccountTransactionsDocument($name: String!, $driveId: String) {
            AccountTransactions_createDocument(name: $name, driveId: $driveId)
          }
        `,
        variables: { name, driveId }
      })
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json() as {
      errors?: Array<{message: string}>;
      data?: {
        AccountTransactions_createDocument?: string;
      };
    };

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'GraphQL error');
    }

    const documentId = result.data?.AccountTransactions_createDocument;
    if (!documentId) {
      throw new Error("Failed to create Account Transactions document");
    }

    return {
      success: true,
      documentId,
      message: "Document created successfully"
    };
  }

  /**
   * Set account information in the Account Transactions document
   * Note: This will be skipped for now as the setAccount GraphQL mutation may not be implemented
   */
  private async setAccountInfo(documentId: string, account: AccountEntry): Promise<void> {

    // TODO: Implement setAccount GraphQL mutation in the subgraph if needed
    // The account information might be set automatically when creating the document
    // or during the fetchTransactionsFromAlchemy process

    // Commented out for now:
    /*
    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation SetAccount($docId: PHID!, $input: AccountTransactions_SetAccountInput!) {
            AccountTransactions_setAccount(docId: $docId, input: $input)
          }
        `,
        variables: {
          docId: documentId,
          input: {
            address: account.account,
            name: account.name
          }
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to set account info: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json() as {
      errors?: Array<{message: string}>;
    };

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to set account info');
    }
    */
  }

  /**
   * Fetch transactions from Alchemy and add them to the document
   */
  private async fetchTransactionsFromAlchemy(
    documentId: string,
    address: string
  ): Promise<{ success: boolean; transactionsAdded?: number; message: string }> {
    const response = await fetch(this.graphqlEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `
          mutation FetchTransactionsFromAlchemy($docId: PHID!, $address: EthereumAddress!) {
            AccountTransactions_fetchTransactionsFromAlchemy(docId: $docId, address: $address) {
              success
              transactionsAdded
              message
            }
          }
        `,
        variables: { docId: documentId, address }
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch transactions: ${response.status} - ${response.statusText}`);
    }

    const result = await response.json() as {
      errors?: Array<{message: string}>;
      data?: {
        AccountTransactions_fetchTransactionsFromAlchemy?: {
          success: boolean;
          transactionsAdded?: number;
          message: string;
        };
      };
    };

    if (result.errors) {
      throw new Error(result.errors[0]?.message || 'Failed to fetch transactions');
    }

    const fetchResult = result.data?.AccountTransactions_fetchTransactionsFromAlchemy;
    if (!fetchResult) {
      throw new Error("No result from transaction fetch");
    }

    return fetchResult;
  }

  /**
   * Update the account with the Account Transactions document ID
   */
  private async updateAccountTransactionsId(
    accountId: string,
    transactionsDocumentId: string
  ): Promise<void> {
    // This would need to be implemented based on your accounts subgraph
    // For now, we'll just log it as the accounts document would need to be updated

    // TODO: Implement account update via GraphQL
    // This would require the accounts subgraph to have an updateAccount mutation
    // that can set the accountTransactionsId field
  }

  /**
   * Get environment information for debugging
   */
  getEnvironmentInfo() {
    return {
      endpoint: this.graphqlEndpoint,
      mode: this.graphqlEndpoint.includes('localhost') ? 'Local Connect' : 'Remote Switchboard'
    };
  }
}

// Export singleton instance
export const accountTransactionsService = new AccountTransactionsService();