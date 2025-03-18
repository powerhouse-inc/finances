/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import { generateMock } from "@powerhousedao/codegen";
import { utils as documentModelUtils } from "document-model";

import utils from "../../gen/utils";
import {
  z,
  CreateAccountInput,
  UpdateAccountInput,
  DeleteAccountInput,
} from "../../gen/schema";
import { reducer } from "../../gen/reducer";
import * as creators from "../../gen/accounts/creators";
import { AccountsDocument } from "../../gen/types";

describe("Accounts Operations", () => {
  let document: AccountsDocument;

  beforeEach(() => {
    document = utils.createDocument();
  });

  it("should handle createAccount operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: CreateAccountInput = generateMock(
      z.CreateAccountInputSchema(),
    );

    const updatedDocument = reducer(document, creators.createAccount(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("CREATE_ACCOUNT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle updateAccount operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: UpdateAccountInput = generateMock(
      z.UpdateAccountInputSchema(),
    );

    const updatedDocument = reducer(document, creators.updateAccount(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("UPDATE_ACCOUNT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
  it("should handle deleteAccount operation", () => {
    // generate a random id
    // const id = documentModelUtils.hashKey();

    const input: DeleteAccountInput = generateMock(
      z.DeleteAccountInputSchema(),
    );

    const updatedDocument = reducer(document, creators.deleteAccount(input));

    expect(updatedDocument.operations.global).toHaveLength(1);
    expect(updatedDocument.operations.global[0].type).toBe("DELETE_ACCOUNT");
    expect(updatedDocument.operations.global[0].input).toStrictEqual(input);
    expect(updatedDocument.operations.global[0].index).toEqual(0);
  });
});
