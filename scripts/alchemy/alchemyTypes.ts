/**
 * Type definitions for Alchemy API integration
 */

export interface AlchemyConfig {
  apiKey: string;
  network: string;
}

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

export interface BlockResponse {
  jsonrpc: string;
  id: number;
  result: {
    timestamp: string;
    [key: string]: any;
  };
}

export interface TransactionEntry {
  counterParty: string;
  amount: { unit: string; value: string };
  txHash: string;
  token: string;
  blockNumber?: number;
  datetime: string;
  accountingPeriod: string;
}