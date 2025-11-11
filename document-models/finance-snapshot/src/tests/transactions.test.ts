/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import { z, type AddTransactionInput } from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/transactions/creators.js";
import type { FinanceSnapshotDocument } from "../../gen/types.js";

describe("Transactions Operations", () => {
  let document: FinanceSnapshotDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle addTransaction operation", () => {
    const input: AddTransactionInput = generateMock(
      z.AddTransactionInputSchema(),
    );

    const updatedDocument = reducer(document, creators.addTransaction(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "ADD_TRANSACTION",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
