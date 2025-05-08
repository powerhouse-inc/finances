import {
  BaseDocumentClass,
  type ExtendedState,
  type PartialState,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import {
  type AccountTransactionsState,
  type AccountTransactionsLocalState,
} from "./types.js";
import { type AccountTransactionsAction } from "./actions.js";
import { reducer } from "./reducer.js";
import utils from "./utils.js";
import AccountTransactions_AccountTransactions from "./account-transactions/object.js";

export * from "./account-transactions/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface AccountTransactions extends AccountTransactions_AccountTransactions {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class AccountTransactions extends BaseDocumentClass<
  AccountTransactionsState,
  AccountTransactionsLocalState,
  AccountTransactionsAction
> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<
      ExtendedState<
        PartialState<AccountTransactionsState>,
        PartialState<AccountTransactionsLocalState>
      >
    >,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, utils.createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, AccountTransactions.fileExtension, name);
  }

  public loadFromFile(path: string) {
    return super.loadFromFile(path);
  }

  static async fromFile(path: string) {
    const document = new this();
    await document.loadFromFile(path);
    return document;
  }
}

applyMixins(AccountTransactions, [AccountTransactions_AccountTransactions]);

export { AccountTransactions };
