/**
 * This is a scaffold file meant for customization:
 * - change it by adding new tests or modifying the existing ones
 */

import utils, {
  initialGlobalState,
  initialLocalState,
} from "../../gen/utils.js";

describe("Account Transactions Document Model", () => {
  it("should create a new Account Transactions document", () => {
    const document = utils.createDocument();

    expect(document).toBeDefined();
    expect(document.documentType).toBe("powerhouse/account-transactions");
  });

  it("should create a new Account Transactions document with a valid initial state", () => {
    const document = utils.createDocument();
    expect(document.state.global).toStrictEqual(initialGlobalState);
    expect(document.state.local).toStrictEqual(initialLocalState);
  });
});
