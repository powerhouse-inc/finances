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
    input: { unit: string; value: number };
    output: { unit: string; value: number };
  };
  Amount_Currency: {
    input: { unit: string; value: number };
    output: { unit: string; value: number };
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
};

export type AccountTransactionsState = {
  account: Maybe<AgentLink>;
  budgets: Array<Budget>;
  transactions: Array<TransactionEntry>;
};

export type AgentLink = {
  icon: Maybe<Scalars["URL"]["output"]>;
  id: Scalars["PHID"]["output"];
  type: Maybe<AgentType | `${AgentType}`>;
  username: Maybe<Scalars["String"]["output"]>;
};

export type AgentType = "AI" | "CONTRIBUTOR" | "TEAM";

export type Budget = {
  id: Scalars["OID"]["input"];
  name?: InputMaybe<Scalars["OLabel"]["input"]>;
};

export type CreateTransactionInput = {
  amount: Scalars["Amount_Money"]["input"];
  budget?: InputMaybe<Scalars["OID"]["input"]>;
  counterParty?: InputMaybe<Scalars["EthereumAddress"]["input"]>;
  datetime: Scalars["DateTime"]["input"];
  details: TransactionDetailsInput;
  id: Scalars["ID"]["input"];
};

export type DeleteTransactionInput = {
  id: Scalars["ID"]["input"];
};

export type TransactionDetails = {
  blockNumber: Maybe<Scalars["Int"]["output"]>;
  token: Scalars["Currency"]["output"];
  txHash: Scalars["String"]["output"];
};

export type TransactionDetailsInput = {
  blockNumber?: InputMaybe<Scalars["Int"]["input"]>;
  token: Scalars["Currency"]["input"];
  txHash: Scalars["String"]["input"];
};

export type TransactionEntry = {
  amount: Scalars["Amount_Tokens"]["output"];
  budget: Maybe<Scalars["OID"]["output"]>;
  counterParty: Maybe<Scalars["EthereumAddress"]["output"]>;
  datetime: Scalars["DateTime"]["output"];
  details: TransactionDetails;
  id: Scalars["ID"]["output"];
};

export type UpdateAccountInput = {
  account?: InputMaybe<Scalars["String"]["input"]>;
};

export type UpdateTransactionBudgetInput = {
  budgetId: Scalars["OID"]["input"];
  name?: InputMaybe<Scalars["OLabel"]["input"]>;
  txId: Scalars["ID"]["input"];
};

export type UpdateTransactionInput = {
  amount?: InputMaybe<Scalars["Amount_Money"]["input"]>;
  budget?: InputMaybe<Scalars["OID"]["input"]>;
  counterParty?: InputMaybe<Scalars["EthereumAddress"]["input"]>;
  datetime?: InputMaybe<Scalars["DateTime"]["input"]>;
  details?: InputMaybe<TransactionDetailsInput>;
  id: Scalars["ID"]["input"];
};
