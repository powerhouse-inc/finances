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

export type AccountEntry = {
  KycAmlStatus: Maybe<KycAmlStatusType | `${KycAmlStatusType}`>;
  account: Scalars["String"]["output"];
  accountTransactionsId: Maybe<Scalars["PHID"]["output"]>;
  budgetPath: Maybe<Scalars["String"]["output"]>;
  chain: Maybe<Array<Scalars["String"]["output"]>>;
  id: Scalars["OID"]["output"];
  name: Scalars["String"]["output"];
  owners: Maybe<Array<Scalars["String"]["output"]>>;
  type: Maybe<AccountType | `${AccountType}`>;
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

export type AccountsState = {
  accounts: Array<AccountEntry>;
};

export type AddAccountInput = {
  KycAmlStatus?: InputMaybe<KycAmlStatusTypeInput | `${KycAmlStatusTypeInput}`>;
  account: Scalars["String"]["input"];
  accountTransactionsId?: InputMaybe<Scalars["PHID"]["input"]>;
  budgetPath?: InputMaybe<Scalars["String"]["input"]>;
  chain?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id: Scalars["OID"]["input"];
  name: Scalars["String"]["input"];
  owners?: InputMaybe<Array<Scalars["String"]["input"]>>;
  type?: InputMaybe<AccountTypeInput | `${AccountTypeInput}`>;
};

export type DeleteAccountInput = {
  id: Scalars["OID"]["input"];
};

export type KycAmlStatusType = "FAILED" | "PASSED" | "PENDING";

export type KycAmlStatusTypeInput = "FAILED" | "PASSED" | "PENDING";

export type UpdateAccountInput = {
  KycAmlStatus?: InputMaybe<KycAmlStatusTypeInput | `${KycAmlStatusTypeInput}`>;
  account?: InputMaybe<Scalars["String"]["input"]>;
  accountTransactionsId?: InputMaybe<Scalars["PHID"]["input"]>;
  budgetPath?: InputMaybe<Scalars["String"]["input"]>;
  chain?: InputMaybe<Array<Scalars["String"]["input"]>>;
  id: Scalars["OID"]["input"];
  name?: InputMaybe<Scalars["String"]["input"]>;
  owners?: InputMaybe<Array<Scalars["String"]["input"]>>;
  type?: InputMaybe<AccountTypeInput | `${AccountTypeInput}`>;
};

export type UpdateKycStatusInput = {
  KycAmlStatus: KycAmlStatusTypeInput | `${KycAmlStatusTypeInput}`;
  id: Scalars["OID"]["input"];
};
