import { z } from "zod";
import type {
  AccountInput,
  AccountType,
  AccountTypeInput,
  AddTransactionInput,
  AddWalletInput,
  CreateSnapshotInput,
  FinanceSnapshotState,
  InitializeFromAccountsInput,
  RefreshSnapshotDataInput,
  RemoveWalletInput,
  SnapshotTransaction,
  SnapshotWallet,
  TransactionFlowType,
  TransactionFlowTypeInput,
  UpdatePeriodInput,
  UpdateWalletBalanceInput,
  WalletBalance,
} from "./types.js";

type Properties<T> = Required<{
  [K in keyof T]: z.ZodType<T[K], any, T[K]>;
}>;

type definedNonNullAny = {};

export const isDefinedNonNullAny = (v: any): v is definedNonNullAny =>
  v !== undefined && v !== null;

export const definedNonNullAnySchema = z
  .any()
  .refine((v) => isDefinedNonNullAny(v));

export const AccountTypeSchema = z.enum([
  "Auditor",
  "Operational",
  "PaymentProcessor",
  "Protocol",
]);

export const AccountTypeInputSchema = z.enum([
  "Auditor",
  "Operational",
  "PaymentProcessor",
  "Protocol",
]);

export const TransactionFlowTypeSchema = z.enum([
  "EXTERNAL_INFLOW",
  "EXTERNAL_OUTFLOW",
  "INTERNAL_TRANSFER",
]);

export const TransactionFlowTypeInputSchema = z.enum([
  "EXTERNAL_INFLOW",
  "EXTERNAL_OUTFLOW",
  "INTERNAL_TRANSFER",
]);

export function AccountInputSchema(): z.ZodObject<Properties<AccountInput>> {
  return z.object({
    accountTransactionsId: z.string(),
    accountType: z.lazy(() => AccountTypeInputSchema),
    address: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      }),
    id: z.string(),
    name: z.string(),
  });
}

export function AddTransactionInputSchema(): z.ZodObject<
  Properties<AddTransactionInput>
> {
  return z.object({
    amount: z.object({ unit: z.string(), value: z.string() }),
    block: z.number().nullish(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      }),
    counterPartyName: z.string().nullish(),
    flowType: z.lazy(() => TransactionFlowTypeInputSchema),
    fromWalletType: z.lazy(() => AccountTypeInputSchema.nullish()),
    id: z.string(),
    timestamp: z.string().datetime(),
    toWalletType: z.lazy(() => AccountTypeInputSchema.nullish()),
    token: z.string(),
    txHash: z.string(),
    txLabel: z.string().nullish(),
  });
}

export function AddWalletInputSchema(): z.ZodObject<
  Properties<AddWalletInput>
> {
  return z.object({
    accountTransactionsRef: z.string().nullish(),
    accountType: z.lazy(() => AccountTypeInputSchema),
    address: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      }),
    id: z.string(),
    label: z.string(),
  });
}

export function CreateSnapshotInputSchema(): z.ZodObject<
  Properties<CreateSnapshotInput>
> {
  return z.object({
    accountsDocumentId: z.string().nullish(),
    created: z.string().datetime(),
    id: z.string(),
    name: z.string(),
    owner: z.string(),
    period: z.string(),
    periodEnd: z.string().datetime(),
    periodStart: z.string().datetime(),
  });
}

export function FinanceSnapshotStateSchema(): z.ZodObject<
  Properties<FinanceSnapshotState>
> {
  return z.object({
    __typename: z.literal("FinanceSnapshotState").optional(),
    accountsDocumentId: z.string().nullable(),
    balances: z.array(WalletBalanceSchema()),
    created: z.string().datetime(),
    id: z.string(),
    name: z.string(),
    owner: z.string(),
    period: z.string(),
    periodEnd: z.string().datetime(),
    periodStart: z.string().datetime(),
    transactions: z.array(SnapshotTransactionSchema()),
    wallets: z.array(SnapshotWalletSchema()),
  });
}

export function InitializeFromAccountsInputSchema(): z.ZodObject<
  Properties<InitializeFromAccountsInput>
> {
  return z.object({
    accounts: z.array(z.lazy(() => AccountInputSchema())),
    accountsDocumentId: z.string(),
    tokens: z.array(z.string()),
  });
}

export function RefreshSnapshotDataInputSchema(): z.ZodObject<
  Properties<RefreshSnapshotDataInput>
> {
  return z.object({
    clearExistingData: z.boolean().nullish(),
    recalculateBalances: z.boolean().nullish(),
  });
}

export function RemoveWalletInputSchema(): z.ZodObject<
  Properties<RemoveWalletInput>
> {
  return z.object({
    walletId: z.string(),
  });
}

export function SnapshotTransactionSchema(): z.ZodObject<
  Properties<SnapshotTransaction>
> {
  return z.object({
    __typename: z.literal("SnapshotTransaction").optional(),
    amount: z.object({ unit: z.string(), value: z.string() }),
    block: z.number().nullable(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      }),
    counterPartyName: z.string().nullable(),
    flowType: TransactionFlowTypeSchema,
    fromWalletType: AccountTypeSchema.nullable(),
    id: z.string(),
    timestamp: z.string().datetime(),
    toWalletType: AccountTypeSchema.nullable(),
    token: z.string(),
    txHash: z.string(),
    txLabel: z.string().nullable(),
  });
}

export function SnapshotWalletSchema(): z.ZodObject<
  Properties<SnapshotWallet>
> {
  return z.object({
    __typename: z.literal("SnapshotWallet").optional(),
    accountTransactionsRef: z.string().nullable(),
    accountType: AccountTypeSchema,
    address: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      }),
    id: z.string(),
    label: z.string(),
  });
}

export function UpdatePeriodInputSchema(): z.ZodObject<
  Properties<UpdatePeriodInput>
> {
  return z.object({
    period: z.string(),
    periodEnd: z.string().datetime(),
    periodStart: z.string().datetime(),
  });
}

export function UpdateWalletBalanceInputSchema(): z.ZodObject<
  Properties<UpdateWalletBalanceInput>
> {
  return z.object({
    accountType: z.lazy(() => AccountTypeInputSchema),
    endingBalance: z.object({ unit: z.string(), value: z.string() }),
    externalInflow: z.object({ unit: z.string(), value: z.string() }),
    externalOutflow: z.object({ unit: z.string(), value: z.string() }),
    id: z.string(),
    internalInflow: z.object({ unit: z.string(), value: z.string() }),
    internalOutflow: z.object({ unit: z.string(), value: z.string() }),
    netExternalChange: z.object({ unit: z.string(), value: z.string() }),
    startingBalance: z.object({ unit: z.string(), value: z.string() }),
    token: z.string(),
    walletAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      }),
  });
}

export function WalletBalanceSchema(): z.ZodObject<Properties<WalletBalance>> {
  return z.object({
    __typename: z.literal("WalletBalance").optional(),
    accountType: AccountTypeSchema,
    endingBalance: z.object({ unit: z.string(), value: z.string() }),
    externalInflow: z.object({ unit: z.string(), value: z.string() }),
    externalOutflow: z.object({ unit: z.string(), value: z.string() }),
    id: z.string(),
    internalInflow: z.object({ unit: z.string(), value: z.string() }),
    internalOutflow: z.object({ unit: z.string(), value: z.string() }),
    netExternalChange: z.object({ unit: z.string(), value: z.string() }),
    startingBalance: z.object({ unit: z.string(), value: z.string() }),
    token: z.string(),
    walletAddress: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      }),
  });
}
