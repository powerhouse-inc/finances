export type ErrorCode = "MissingTransactionsError";

export interface ReducerError {
  errorCode: ErrorCode;
}

export class MissingTransactionsError extends Error implements ReducerError {
  errorCode = "MissingTransactionsError" as ErrorCode;
  constructor(message = "MissingTransactionsError") {
    super(message);
  }
}

export const errors = {
  InitializeFromAccounts: {
    MissingTransactionsError,
  },
};
