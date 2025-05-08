import {
  BaseDocumentClass,
  type ExtendedState,
  type PartialState,
  applyMixins,
  type SignalDispatch,
} from "document-model";
import { type AccountsState, type AccountsLocalState } from "./types.js";
import { type AccountsAction } from "./actions.js";
import { reducer } from "./reducer.js";
import utils from "./utils.js";
import Accounts_Accounts from "./accounts/object.js";

export * from "./accounts/object.js";

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
interface Accounts extends Accounts_Accounts {}

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
class Accounts extends BaseDocumentClass<
  AccountsState,
  AccountsLocalState,
  AccountsAction
> {
  static fileExtension = ".phdm";

  constructor(
    initialState?: Partial<
      ExtendedState<
        PartialState<AccountsState>,
        PartialState<AccountsLocalState>
      >
    >,
    dispatch?: SignalDispatch,
  ) {
    super(reducer, utils.createDocument(initialState), dispatch);
  }

  public saveToFile(path: string, name?: string) {
    return super.saveToFile(path, Accounts.fileExtension, name);
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

applyMixins(Accounts, [Accounts_Accounts]);

export { Accounts };
