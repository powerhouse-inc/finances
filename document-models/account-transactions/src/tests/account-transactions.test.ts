/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from "@powerhousedao/codegen";
import { utils as documentModelUtils } from "document-model";

import utils from "../../gen/utils";
import {
  z,
  CreateTransactionInput,
  UpdateTransactionInput,
  DeleteTransactionInput,
  UpdateTransactionBudgetInput,
} from "../../gen/schema";
import { reducer } from "../../gen/reducer";
import * as creators from "../../gen/account-transactions/creators";
import { AccountTransactionsDocument } from "../../gen/types";

describe("AccountTransactions Operations", () => {
  let document: AccountTransactionsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle createTransaction operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: CreateTransactionInput = generateMock(
      z.CreateTransactionInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.createTransaction(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "CREATE_TRANSACTION",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateTransaction operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: UpdateTransactionInput = generateMock(
      z.UpdateTransactionInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.updateTransaction(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "UPDATE_TRANSACTION",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle deleteTransaction operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: DeleteTransactionInput = generateMock(
      z.DeleteTransactionInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.deleteTransaction(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "DELETE_TRANSACTION",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateTransactionBudget operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: UpdateTransactionBudgetInput = generateMock(
      z.UpdateTransactionBudgetInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.updateTransactionBudget(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe(
      "UPDATE_TRANSACTION_BUDGET",
    );
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
