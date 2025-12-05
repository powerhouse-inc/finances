// TODO: remove eslint-disable rules once refactor is done
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import type { StateReducer } from "document-model";
import { isDocumentAction, createReducer } from "document-model/core";
import type { FinanceSnapshotPHState } from "./types.js";
import { z } from "./types.js";

import { reducer as SnapshotReducer } from "../src/reducers/snapshot.js";
import { reducer as TransactionsReducer } from "../src/reducers/transactions.js";
import { reducer as BalancesReducer } from "../src/reducers/balances.js";

export const stateReducer: StateReducer<FinanceSnapshotPHState> = (
  state,
  action,
  dispatch,
) => {
  if (isDocumentAction(action)) {
    return state;
  }

  switch (action.type) {
    case "CREATE_SNAPSHOT":
      z.CreateSnapshotInputSchema().parse(action.input);
      SnapshotReducer.createSnapshotOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_WALLET":
      z.AddWalletInputSchema().parse(action.input);
      SnapshotReducer.addWalletOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REMOVE_WALLET":
      z.RemoveWalletInputSchema().parse(action.input);
      SnapshotReducer.removeWalletOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_PERIOD":
      z.UpdatePeriodInputSchema().parse(action.input);
      SnapshotReducer.updatePeriodOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "REFRESH_SNAPSHOT_DATA":
      z.RefreshSnapshotDataInputSchema().parse(action.input);
      SnapshotReducer.refreshSnapshotDataOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "INITIALIZE_FROM_ACCOUNTS":
      z.InitializeFromAccountsInputSchema().parse(action.input);
      SnapshotReducer.initializeFromAccountsOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "ADD_TRANSACTION":
      z.AddTransactionInputSchema().parse(action.input);
      TransactionsReducer.addTransactionOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    case "UPDATE_WALLET_BALANCE":
      z.UpdateWalletBalanceInputSchema().parse(action.input);
      BalancesReducer.updateWalletBalanceOperation(
        (state as any)[action.scope],
        action as any,
        dispatch,
      );
      break;

    default:
      return state;
  }
};

export const reducer = createReducer<FinanceSnapshotPHState>(stateReducer);
