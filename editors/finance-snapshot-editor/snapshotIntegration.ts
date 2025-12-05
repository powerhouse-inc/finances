/**
 * Environment-aware Snapshot integration for FinanceSnapshot
 * Follows the contributor-billing pattern for local/remote compatibility
 */

import { getAlchemyGraphQLEndpoint, isLocalEnvironment } from "../../scripts/alchemy/alchemyEnvironment.js";

export interface GenerateSnapshotResult {
  success: boolean;
  message: string;
  snapshotId: string | null;
  accountsProcessed: number;
  transactionsImported: number;
  balancesCalculated: number;
}

export class SnapshotIntegrationService {
  private graphqlEndpoint: string;
  private isLocal: boolean;

  constructor() {
    this.graphqlEndpoint = getAlchemyGraphQLEndpoint();
    this.isLocal = isLocalEnvironment();
  }

  /**
   * Generate snapshot from accounts via GraphQL resolver
   * Works in both local Connect and remote Switchboard environments
   */
  async generateSnapshotFromAccounts(
    docId: string,
    accountsDocumentId: string,
    owner: string,
    periodStart: string,
    periodEnd: string,
  ): Promise<GenerateSnapshotResult> {
    try {
      const response = await fetch(this.graphqlEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `
            mutation GenerateSnapshotFromAccounts(
              $docId: PHID!
              $accountsDocumentId: PHID!
              $owner: String!
              $periodStart: DateTime!
              $periodEnd: DateTime!
            ) {
              FinanceSnapshot_generateSnapshotFromAccounts(
                docId: $docId
                accountsDocumentId: $accountsDocumentId
                owner: $owner
                periodStart: $periodStart
                periodEnd: $periodEnd
              ) {
                success
                message
                snapshotId
                accountsProcessed
                transactionsImported
                balancesCalculated
              }
            }
          `,
          variables: {
            docId,
            accountsDocumentId,
            owner,
            periodStart,
            periodEnd,
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[SnapshotIntegration] GraphQL endpoint error:`, {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        throw new Error(`GraphQL endpoint error: ${response.status} - ${response.statusText} - ${errorText}`);
      }

      const result = await response.json() as {
        errors?: Array<{message: string}>;
        data?: {
          FinanceSnapshot_generateSnapshotFromAccounts?: GenerateSnapshotResult;
        };
      };

      if (result.errors) {
        throw new Error(result.errors[0]?.message || 'GraphQL error');
      }

      if (result.data?.FinanceSnapshot_generateSnapshotFromAccounts) {
        return result.data.FinanceSnapshot_generateSnapshotFromAccounts;
      } else {
        throw new Error("Failed to generate snapshot from accounts");
      }

    } catch (error) {
      console.error(`[SnapshotIntegration] Error in ${this.isLocal ? 'local' : 'remote'} mode:`, error);
      throw error;
    }
  }

  /**
   * Get environment information for debugging
   */
  getEnvironmentInfo() {
    return {
      endpoint: this.graphqlEndpoint,
      mode: this.isLocal ? 'Local Connect' : 'Remote Switchboard',
      isLocal: this.isLocal
    };
  }
}

// Export singleton instance following the pattern
export const snapshotIntegration = new SnapshotIntegrationService();
