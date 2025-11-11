/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { describe, it, expect, beforeEach } from "vitest";
import { generateMock } from "@powerhousedao/codegen";
import utils from "../../gen/utils.js";
import {
  z,
  type CreateSnapshotInput,
  type AddWalletInput,
  type RemoveWalletInput,
  type UpdatePeriodInput,
  type RefreshSnapshotDataInput,
} from "../../gen/schema/index.js";
import { reducer } from "../../gen/reducer.js";
import * as creators from "../../gen/snapshot/creators.js";
import type { FinanceSnapshotDocument } from "../../gen/types.js";

describe("Snapshot Operations", () => {
  let document: FinanceSnapshotDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle createSnapshot operation", () => {
    const input: CreateSnapshotInput = generateMock(
      z.CreateSnapshotInputSchema(),
    );

    const updatedDocument = reducer(document, creators.createSnapshot(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "CREATE_SNAPSHOT",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle addWallet operation", () => {
    const input: AddWalletInput = generateMock(z.AddWalletInputSchema());

    const updatedDocument = reducer(document, creators.addWallet(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe("ADD_WALLET");
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle removeWallet operation", () => {
    const input: RemoveWalletInput = generateMock(z.RemoveWalletInputSchema());

    const updatedDocument = reducer(document, creators.removeWallet(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REMOVE_WALLET",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updatePeriod operation", () => {
    const input: UpdatePeriodInput = generateMock(z.UpdatePeriodInputSchema());

    const updatedDocument = reducer(document, creators.updatePeriod(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "UPDATE_PERIOD",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle refreshSnapshotData operation", () => {
    const input: RefreshSnapshotDataInput = generateMock(
      z.RefreshSnapshotDataInputSchema(),
    );

    const updatedDocument = reducer(
      document,
      creators.refreshSnapshotData(input),
    );

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].action.type).toBe(
      "REFRESH_SNAPSHOT_DATA",
    );
    expect(updatedDocument.operations.global[0].action.input).toStrictEqual(
      input,
    );
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
