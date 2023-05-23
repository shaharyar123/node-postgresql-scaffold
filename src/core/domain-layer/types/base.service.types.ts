import type { Transaction } from "sequelize";

export type TransactionStore = {
	transaction: Transaction;
};

export type RunningTransaction = {
	currentTransaction: TransactionStore;
	createdOnThisLevel: boolean;
};

export type TransactionCallback<T> = (runningTransaction: RunningTransaction) => Promise<T>;

export type TransactionError = (error: unknown) => Promise<void>;

export type TransactionalOperation<TransactionReturn> = {
	withTransaction?: RunningTransaction;
	transactionCallback: TransactionCallback<TransactionReturn>;
	failureCallback?: TransactionError;
};
