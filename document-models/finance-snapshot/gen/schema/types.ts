export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Amount: {
    input: { unit?: string; value?: number };
    output: { unit?: string; value?: number };
  };
  Amount_Crypto: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Currency: {
    input: { unit: string; value: string };
    output: { unit: string; value: string };
  };
  Amount_Fiat: {
    input: { unit: string; value: number };
    output: { unit: string; value: number };
  };
  Amount_Money: { input: number; output: number };
  Amount_Percentage: { input: number; output: number };
  Amount_Tokens: { input: number; output: number };
  Currency: { input: string; output: string };
  Date: { input: string; output: string };
  DateTime: { input: string; output: string };
  EmailAddress: { input: string; output: string };
  EthereumAddress: { input: string; output: string };
  OID: { input: string; output: string };
  OLabel: { input: string; output: string };
  PHID: { input: string; output: string };
  URL: { input: string; output: string };
  Upload: { input: File; output: File };
};

export type AccountInput = {
  accountTransactionsId: Scalars["PHID"]["input"];
  accountType: AccountTypeInput | `${AccountTypeInput}`;
  address: Scalars["EthereumAddress"]["input"];
  id: Scalars["OID"]["input"];
  name: Scalars["String"]["input"];
};

export type AccountType =
  | "Auditor"
  | "Operational"
  | "PaymentProcessor"
  | "Protocol";

export type AccountTypeInput =
  | "Auditor"
  | "Operational"
  | "PaymentProcessor"
  | "Protocol";

export type AddTransactionInput = {
  amount: Scalars["Amount_Currency"]["input"];
  block?: InputMaybe<Scalars["Int"]["input"]>;
  counterParty: Scalars["EthereumAddress"]["input"];
  counterPartyName?: InputMaybe<Scalars["String"]["input"]>;
  flowType: TransactionFlowTypeInput | `${TransactionFlowTypeInput}`;
  fromWalletType?: InputMaybe<AccountTypeInput | `${AccountTypeInput}`>;
  id: Scalars["ID"]["input"];
  timestamp: Scalars["DateTime"]["input"];
  toWalletType?: InputMaybe<AccountTypeInput | `${AccountTypeInput}`>;
  token: Scalars["Currency"]["input"];
  txHash: Scalars["String"]["input"];
  txLabel?: InputMaybe<Scalars["String"]["input"]>;
};

export type AddWalletInput = {
  accountTransactionsRef?: InputMaybe<Scalars["PHID"]["input"]>;
  accountType: AccountTypeInput | `${AccountTypeInput}`;
  address: Scalars["EthereumAddress"]["input"];
  id: Scalars["OID"]["input"];
  label: Scalars["String"]["input"];
};

export type CreateSnapshotInput = {
  accountsDocumentId?: InputMaybe<Scalars["PHID"]["input"]>;
  created: Scalars["DateTime"]["input"];
  id: Scalars["OID"]["input"];
  name: Scalars["String"]["input"];
  owner: Scalars["String"]["input"];
  period: Scalars["String"]["input"];
  periodEnd: Scalars["DateTime"]["input"];
  periodStart: Scalars["DateTime"]["input"];
};

export type FinanceSnapshotState = {
  accountsDocumentId: Maybe<Scalars["PHID"]["output"]>;
  balances: Array<WalletBalance>;
  created: Scalars["DateTime"]["output"];
  id: Scalars["OID"]["output"];
  name: Scalars["String"]["output"];
  owner: Scalars["String"]["output"];
  period: Scalars["String"]["output"];
  periodEnd: Scalars["DateTime"]["output"];
  periodStart: Scalars["DateTime"]["output"];
  transactions: Array<SnapshotTransaction>;
  wallets: Array<SnapshotWallet>;
};

export type InitializeFromAccountsInput = {
  accounts: Array<AccountInput>;
  accountsDocumentId: Scalars["PHID"]["input"];
  tokens: Array<Scalars["Currency"]["input"]>;
};

export type RefreshSnapshotDataInput = {
  clearExistingData?: InputMaybe<Scalars["Boolean"]["input"]>;
  recalculateBalances?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type RemoveWalletInput = {
  walletId: Scalars["OID"]["input"];
};

export type SnapshotTransaction = {
  amount: Scalars["Amount_Currency"]["output"];
  block: Maybe<Scalars["Int"]["output"]>;
  counterParty: Scalars["EthereumAddress"]["output"];
  counterPartyName: Maybe<Scalars["String"]["output"]>;
  flowType: TransactionFlowType | `${TransactionFlowType}`;
  fromWalletType: Maybe<AccountType | `${AccountType}`>;
  id: Scalars["ID"]["output"];
  timestamp: Scalars["DateTime"]["output"];
  toWalletType: Maybe<AccountType | `${AccountType}`>;
  token: Scalars["Currency"]["output"];
  txHash: Scalars["String"]["output"];
  txLabel: Maybe<Scalars["String"]["output"]>;
};

export type SnapshotWallet = {
  accountTransactionsRef: Maybe<Scalars["PHID"]["output"]>;
  accountType: AccountType | `${AccountType}`;
  address: Scalars["EthereumAddress"]["output"];
  id: Scalars["OID"]["output"];
  label: Scalars["String"]["output"];
};

export type TransactionFlowType =
  | "EXTERNAL_INFLOW"
  | "EXTERNAL_OUTFLOW"
  | "INTERNAL_TRANSFER";

export type TransactionFlowTypeInput =
  | "EXTERNAL_INFLOW"
  | "EXTERNAL_OUTFLOW"
  | "INTERNAL_TRANSFER";

export type UpdatePeriodInput = {
  period: Scalars["String"]["input"];
  periodEnd: Scalars["DateTime"]["input"];
  periodStart: Scalars["DateTime"]["input"];
};

export type UpdateWalletBalanceInput = {
  accountType: AccountTypeInput | `${AccountTypeInput}`;
  endingBalance: Scalars["Amount_Currency"]["input"];
  externalInflow: Scalars["Amount_Currency"]["input"];
  externalOutflow: Scalars["Amount_Currency"]["input"];
  id: Scalars["OID"]["input"];
  internalInflow: Scalars["Amount_Currency"]["input"];
  internalOutflow: Scalars["Amount_Currency"]["input"];
  netExternalChange: Scalars["Amount_Currency"]["input"];
  startingBalance: Scalars["Amount_Currency"]["input"];
  token: Scalars["Currency"]["input"];
  walletAddress: Scalars["EthereumAddress"]["input"];
};

export type WalletBalance = {
  accountType: AccountType | `${AccountType}`;
  endingBalance: Scalars["Amount_Currency"]["output"];
  externalInflow: Scalars["Amount_Currency"]["output"];
  externalOutflow: Scalars["Amount_Currency"]["output"];
  id: Scalars["OID"]["output"];
  internalInflow: Scalars["Amount_Currency"]["output"];
  internalOutflow: Scalars["Amount_Currency"]["output"];
  netExternalChange: Scalars["Amount_Currency"]["output"];
  startingBalance: Scalars["Amount_Currency"]["output"];
  token: Scalars["Currency"]["output"];
  walletAddress: Scalars["EthereumAddress"]["output"];
};
