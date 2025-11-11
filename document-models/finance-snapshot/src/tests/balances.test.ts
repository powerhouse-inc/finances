/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import { z, type UpdateWalletBalanceInput } from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/balances/creators.js";
import type { FinanceSnapshotDocument } from "../../gen/types.js";

describe("Balances Operations", () => {
  let document: FinanceSnapshotDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle updateWalletBalance operation", () => {
    const input: UpdateWalletBalanceInput = generateMock(
      z.UpdateWalletBalanceInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.updateWalletBalance(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_WALLET_BALANCE",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
