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
  contractAddresses?: string[];
  category?: ("external" | "internal" | "erc20" | "erc721" | "erc1155")[];
  maxCount?: string;
  pageKey?: string;
  excludeZeroValue?: boolean;
  withMetadata?: boolean;
}

// Supported token contract addresses
export const SUPPORTED_TOKEN_CONTRACTS = {
  USDC: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  USDS: "0xdc035d45d973e3ec169d2276ddab16f1e407384f",
  DAI: "0x6b175474e89094c44da98b954eedeac495271d0f",
  MKR: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
  SKY: "0x56072c95faa701256059aa122697b133aded9279"
} as const;

export interface BlockResponse {
  jsonrpc: string;
  id: number;
  result: {
    timestamp: string;
    [key: string]: any;
  };
}

export interface TransactionEntry {
  uniqueId: string; // Alchemy's unique identifier (includes log index for ERC20 transfers)
  counterParty: string;
  amount: { unit: string; value: string };
  txHash: string;
  token: string;
  blockNumber?: number;
  datetime: string;
  accountingPeriod: string;
  from: string;
  to: string;
  direction: 'INFLOW' | 'OUTFLOW';
}