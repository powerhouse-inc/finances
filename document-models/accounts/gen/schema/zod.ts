import { z } from "zod";
import type {
  AccountEntry,
  AccountType,
  AccountsState,
  CreateAccountInput,
  DeleteAccountInput,
  UpdateAccountInput,
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
  "Payment",
  "Processor",
  "Protocol",
]);

export function AccountEntrySchema(): z.ZodObject<Properties<AccountEntry>> {
  return z.object({
    __typename: z.literal("AccountEntry").optional(),
    account: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullable(),
    accountTransactionsId: z.string().nullable(),
    budgetPath: z.string().nullable(),
    chain: z.string().nullable(),
    id: z.string(),
    name: z.string().nullable(),
    owners: z.array(z.string().nullable()).nullable(),
    type: AccountTypeSchema.nullable(),
  });
}

export function AccountsStateSchema(): z.ZodObject<Properties<AccountsState>> {
  return z.object({
    __typename: z.literal("AccountsState").optional(),
    accounts: z.array(AccountEntrySchema()),
  });
}

export function CreateAccountInputSchema(): z.ZodObject<
  Properties<CreateAccountInput>
> {
  return z.object({
    account: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
    accountTransactionsId: z.string().nullish(),
    budgetPath: z.string().nullish(),
    chain: z.string().nullish(),
    id: z.string(),
    name: z.string().nullish(),
    owners: z.array(z.string().nullish()).nullish(),
    type: AccountTypeSchema.nullish(),
  });
}

export function DeleteAccountInputSchema(): z.ZodObject<
  Properties<DeleteAccountInput>
> {
  return z.object({
    id: z.string(),
  });
}

export function UpdateAccountInputSchema(): z.ZodObject<
  Properties<UpdateAccountInput>
> {
  return z.object({
    account: z
      .string()
      .regex(/^0x[a-fA-F0-9]{40}$/, {
        message: "Invalid Ethereum address format",
      })
      .nullish(),
    accountTransactionsId: z.string().nullish(),
    budgetPath: z.string().nullish(),
    chain: z.string().nullish(),
    id: z.string(),
    name: z.string().nullish(),
    owners: z.array(z.string().nullish()).nullish(),
    type: AccountTypeSchema.nullish(),
  });
}
