/**
 * Alchemy API integration service for fetching transaction data
 */

import dotenv from 'dotenv';

export interface AlchemyAssetTransfer {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value?: number;
  erc721TokenId?: string;
  erc1155Metadata?: any;
  tokenId?: string;
  asset: string;
  category: "external" | "internal" | "erc20" | "erc721" | "erc1155";
  rawContract: {
    value: string;
    address: string;
    decimal: string;
  };
}

export interface AlchemyResponse {
  jsonrpc: string;
  id: number;
  result: {
    transfers: AlchemyAssetTransfer[];
    pageKey?: string;
  };
}

export interface AlchemyErrorResponse {
  jsonrpc: string;
  id: number;
  error: {
    code: number;
    message: string;
  };
}

export interface GetAssetTransfersParams {
  fromBlock?: string;
  toBlock?: string;
  fromAddress?: string;
  toAddress?: string;
  category?: ("external" | "internal" | "erc20" | "erc721" | "erc1155")[];
  maxCount?: string;
  pageKey?: string;
  excludeZeroValue?: boolean;
}

export class AlchemyService {
  
  private baseURL: string;

  constructor(apiKey?: string) {
    const key = apiKey || process.env.ALCHEMY_API_KEY;
    this.baseURL = `https://eth-mainnet.g.alchemy.com/v2/${key}`;
  }

  /**
   * Fetch asset transfers using Alchemy's getAssetTransfers method
   */
  async getAssetTransfers(params: GetAssetTransfersParams): Promise<AlchemyResponse> {
    const data = {
      jsonrpc: "2.0",
      id: 0,
      method: "alchemy_getAssetTransfers",
      params: [params]
    };

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json() as AlchemyResponse | AlchemyErrorResponse;

      if ('error' in result) {
        throw new Error(`Alchemy API error: ${result.error.message}`);
      }

      return result;
    } catch (error) {
      console.error('Error fetching asset transfers:', error);
      throw error;
    }
  }

  /**
   * Get ERC20 transactions for a specific address
   */
  async getERC20Transactions(address: string, fromBlock: string = "0x0"): Promise<AlchemyAssetTransfer[]> {
    const params: GetAssetTransfersParams = {
      fromBlock,
      fromAddress: address,
      category: ["erc20"],
      excludeZeroValue: true,
      maxCount: "0x3e8" // 1000 transactions max
    };

    const response = await this.getAssetTransfers(params);
    return response.result.transfers;
  }

  /**
   * Get all transactions (external, internal, ERC20) for a specific address
   */
  async getAllTransactions(address: string, fromBlock: string = "0x0"): Promise<AlchemyAssetTransfer[]> {
    const params: GetAssetTransfersParams = {
      fromBlock,
      fromAddress: address,
      category: ["external", "internal", "erc20", "erc721", "erc1155"],
      excludeZeroValue: true,
      maxCount: "0x3e8" // 1000 transactions max
    };

    const response = await this.getAssetTransfers(params);
    return response.result.transfers;
  }

  /**
   * Convert Alchemy transaction to our document model format
   */
  convertToTransactionEntry(transfer: AlchemyAssetTransfer, fromAddress: string, blockTimestamp?: number): {
    counterParty: string;
    amount: { unit: string; value: string };
    txHash: string;
    token: string;
    blockNumber?: number;
    datetime: string;
    accountingPeriod: string;
  } {
    // Convert value based on decimals for ERC20 tokens
    let value: string;
    if (transfer.category === "erc20" && transfer.rawContract.decimal) {
      const decimals = parseInt(transfer.rawContract.decimal, 16);
      const rawValue = parseInt(transfer.rawContract.value, 16);
      value = (rawValue / Math.pow(10, decimals)).toString();
    } else {
      value = transfer.value?.toString() || transfer.rawContract.value || "0";
    }

    const token = transfer.asset || "ETH";

    // Determine counterparty (if it's from our address, counterparty is 'to', otherwise 'from')
    const counterParty = transfer.from.toLowerCase() === fromAddress.toLowerCase()
      ? transfer.to
      : transfer.from;

    // Use provided timestamp or fallback to current time
    const datetime = blockTimestamp
      ? new Date(blockTimestamp).toISOString()
      : new Date().toISOString();

    // Extract year from the actual transaction date for accounting period
    const transactionDate = new Date(blockTimestamp || Date.now());

    return {
      counterParty,
      amount: {
        unit: token,
        value: value
      },
      txHash: transfer.hash,
      token: token,
      blockNumber: parseInt(transfer.blockNum, 16),
      datetime: datetime,
      accountingPeriod: transactionDate.getFullYear().toString()
    };
  }

  /**
   * Get timestamps for multiple blocks efficiently (batch unique blocks)
   */
  async getBlockTimestamps(blockNumbers: string[]): Promise<Map<string, number>> {
    const uniqueBlocks = [...new Set(blockNumbers)];
    const timestampMap = new Map<string, number>();

    // Fetch timestamps for unique blocks in parallel (but limit concurrency)
    const BATCH_SIZE = 5; // Limit concurrent requests to avoid rate limiting

    for (let i = 0; i < uniqueBlocks.length; i += BATCH_SIZE) {
      const batch = uniqueBlocks.slice(i, i + BATCH_SIZE);
      const promises = batch.map(async (blockNum) => {
        try {
          const timestamp = await this.getBlockTimestamp(blockNum);
          timestampMap.set(blockNum, timestamp);
        } catch (error) {
          console.warn(`Failed to fetch timestamp for block ${blockNum}, using current time`);
          timestampMap.set(blockNum, Date.now());
        }
      });

      await Promise.all(promises);
    }

    return timestampMap;
  }

  /**
   * Get block timestamp using eth_getBlockByNumber
   */
  async getBlockTimestamp(blockNumber: string): Promise<number> {
    const data = {
      jsonrpc: "2.0",
      id: 0,
      method: "eth_getBlockByNumber",
      params: [blockNumber, false] // false = don't include full transaction objects
    };

    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(`Alchemy API error: ${result.error.message}`);
      }

      // Convert hex timestamp to number (seconds) then to milliseconds
      const timestampHex = result.result.timestamp;
      const timestampSeconds = parseInt(timestampHex, 16);
      return timestampSeconds * 1000; // Convert to milliseconds
    } catch (error) {
      console.error('Error fetching block timestamp:', error);
      // Fallback to current time if block timestamp fails
      return Date.now();
    }
  }

  /**
   * Validate Ethereum address format
   */
  private isValidEthereumAddress(address: string): boolean {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  }

  /**
   * Get formatted transactions ready for document model creation
   */
  async getFormattedTransactions(address: string, options: {
    fromBlock?: string;
    includeERC20?: boolean;
    includeExternal?: boolean;
    includeInternal?: boolean;
    maxCount?: number;
  } = {}): Promise<Array<{
    counterParty: string;
    amount: { unit: string; value: string };
    txHash: string;
    token: string;
    blockNumber?: number;
    datetime: string;
    accountingPeriod: string;
  }>> {

    if (!this.isValidEthereumAddress(address)) {
      throw new Error(`Invalid Ethereum address format: ${address}`);
    }

    const {
      fromBlock = "0x0",
      includeERC20 = true,
      includeExternal = true,
      includeInternal = false,
      maxCount = 100
    } = options;

    const categories: ("external" | "internal" | "erc20" | "erc721" | "erc1155")[] = [];
    if (includeExternal) categories.push("external");
    if (includeInternal) categories.push("internal");
    if (includeERC20) categories.push("erc20");

    if (categories.length === 0) {
      throw new Error("At least one transaction category must be included");
    }

    const params: GetAssetTransfersParams = {
      fromBlock,
      fromAddress: address,
      category: categories,
      excludeZeroValue: true,
      maxCount: `0x${maxCount.toString(16)}`
    };

    try {
      const response = await this.getAssetTransfers(params);
      const transfers = response.result.transfers;

      // Get block numbers for timestamp fetching
      const blockNumbers = transfers.map(t => t.blockNum);
      const timestampMap = await this.getBlockTimestamps(blockNumbers);

      // Convert transfers with actual timestamps
      return transfers.map(transfer => {
        const blockTimestamp = timestampMap.get(transfer.blockNum);
        return this.convertToTransactionEntry(transfer, address, blockTimestamp);
      });
    } catch (error) {
      console.error(`Failed to fetch transactions for address ${address}:`, error);
      throw new Error(`Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get transactions where the address is the receiver (toAddress)
   */
  async getTransactionsToAddress(address: string, options: {
    fromBlock?: string;
    includeERC20?: boolean;
    includeExternal?: boolean;
    includeInternal?: boolean;
    maxCount?: number;
  } = {}): Promise<Array<{
    counterParty: string;
    amount: { unit: string; value: string };
    txHash: string;
    token: string;
    blockNumber?: number;
    datetime: string;
    accountingPeriod: string;
  }>> {

    if (!this.isValidEthereumAddress(address)) {
      throw new Error(`Invalid Ethereum address format: ${address}`);
    }

    const {
      fromBlock = "0x0",
      includeERC20 = true,
      includeExternal = true,
      includeInternal = false,
      maxCount = 100
    } = options;

    const categories: ("external" | "internal" | "erc20" | "erc721" | "erc1155")[] = [];
    if (includeExternal) categories.push("external");
    if (includeInternal) categories.push("internal");
    if (includeERC20) categories.push("erc20");

    if (categories.length === 0) {
      throw new Error("At least one transaction category must be included");
    }

    const params: GetAssetTransfersParams = {
      fromBlock,
      toAddress: address, // Use toAddress instead of fromAddress
      category: categories,
      excludeZeroValue: true,
      maxCount: `0x${maxCount.toString(16)}`
    };

    try {
      const response = await this.getAssetTransfers(params);
      const transfers = response.result.transfers;

      // Get block numbers for timestamp fetching
      const blockNumbers = transfers.map(t => t.blockNum);
      const timestampMap = await this.getBlockTimestamps(blockNumbers);

      // Convert transfers with actual timestamps
      return transfers.map(transfer => {
        const blockTimestamp = timestampMap.get(transfer.blockNum);
        return this.convertToTransactionEntry(transfer, address, blockTimestamp);
      });
    } catch (error) {
      console.error(`Failed to fetch transactions to address ${address}:`, error);
      throw new Error(`Failed to fetch transactions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export singleton instance
export const alchemyService = new AlchemyService();