import { z } from "zod";
import type {
  AccountTransactionsState,
  AgentLink,
  AgentType,
  Budget,
  CreateTransactionInput,
  DeleteTransactionInput,
  TransactionDetails,
  TransactionDetailsInput,
  TransactionEntry,
  UpdateAccountInput,
  UpdateTransactionBudgetInput,
  UpdateTransactionInput,
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

export const AgentTypeSchema = z.enum(["AI", "CONTRIBUTOR", "TEAM"]);

export function AccountTransactionsStateSchema(): z.ZodObject<
  Properties<AccountTransactionsState>
> {
  return z.object({
    __typename: z.literal("AccountTransactionsState").optional(),
    account: AgentLinkSchema().nullable(),
    budgets: z.array(BudgetSchema()),
    transactions: z.array(TransactionEntrySchema()),
  });
}

export function AgentLinkSchema(): z.ZodObject<Properties<AgentLink>> {
  return z.object({
    __typename: z.literal("AgentLink").optional(),
    icon: z.string().url().nullable(),
    id: z.string(),
    type: AgentTypeSchema.nullable(),
    username: z.string().nullable(),
  });
}

export function BudgetSchema(): z.ZodObject<Properties<Budget>> {
  return z.object({
    id: z.string(),
    name: z.string().nullish(),
  });
}

export function CreateTransactionInputSchema(): z.ZodObject<
  Properties<CreateTransactionInput>
> {
  return z.object({
    amount: z.number(),
    budget: z.string().nullish(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
    datetime: z.string().datetime(),
    details: z.lazy(() => TransactionDetailsInputSchema()),
    id: z.string(),
  });
}

export function DeleteTransactionInputSchema(): z.ZodObject<
  Properties<DeleteTransactionInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function TransactionDetailsSchema(): z.ZodObject<
  Properties<TransactionDetails>
> {
  return z.object({
    __typename: z.literal("TransactionDetails").optional(),
    blockNumber: z.number().nullable(),
    token: z.string(),
    txHash: z.string(),
  });
}

export function TransactionDetailsInputSchema(): z.ZodObject<
  Properties<TransactionDetailsInput>
> {
  return z.object({
    blockNumber: z.number().nullish(),
    token: z.string(),
    txHash: z.string(),
  });
}

export function TransactionEntrySchema(): z.ZodObject<
  Properties<TransactionEntry>
> {
  return z.object({
    __typename: z.literal("TransactionEntry").optional(),
    amount: z.number(),
    budget: z.string().nullable(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullable(),
    datetime: z.string().datetime(),
    details: TransactionDetailsSchema(),
    id: z.string(),
  });
}

export function UpdateAccountInputSchema(): z.ZodObject<
  Properties<UpdateAccountInput>
> {
  return z.object({
    account: z.string().nullish(),
  });
}

export function UpdateTransactionBudgetInputSchema(): z.ZodObject<
  Properties<UpdateTransactionBudgetInput>
> {
  return z.object({
    budgetId: z.string(),
    name: z.string().nullish(),
    txId: z.string(),
  });
}

export function UpdateTransactionInputSchema(): z.ZodObject<
  Properties<UpdateTransactionInput>
> {
  return z.object({
    amount: z.number().nullish(),
    budget: z.string().nullish(),
    counterParty: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
    datetime: z.string().datetime().nullish(),
    details: z.lazy(() => TransactionDetailsInputSchema().nullish()),
    id: z.string(),
  });
}
