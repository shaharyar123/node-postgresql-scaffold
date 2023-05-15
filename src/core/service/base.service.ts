import type { RunningTransaction, TransactionalOperation, TransactionStore } from "@/core/service/base.service.types";
import { BaseError, type Transaction } from "sequelize";
import { InternalServerException } from "@/modules/common/exceptions";
import { ConfigService } from "@/modules/config/services";
import type { Sequelize } from "sequelize-typescript";

export class BaseService {
	public async executeTransactionalOperation<T>(transactionalOperation: TransactionalOperation<T>): Promise<T> {
		const preparedTransaction: RunningTransaction = await this.prepareTransaction(transactionalOperation.withTransaction);

		try {
			const transactionResult: T = await transactionalOperation.transactionCallback(preparedTransaction);

			await this.wrapUpTransaction(preparedTransaction);

			return transactionResult;
		} catch (error: unknown) {
			if (error instanceof BaseError) await preparedTransaction.currentTransaction.transaction.rollback();

			if (transactionalOperation.failureCallback) await transactionalOperation.failureCallback(error);

			throw this.createInternalServerError(error);
		}
	}

	private async prepareTransaction(preparedTransaction?: RunningTransaction): Promise<RunningTransaction> {
		if (preparedTransaction)
			return {
				currentTransaction: preparedTransaction.currentTransaction,
				createdOnThisLevel: false,
			};

		return {
			currentTransaction: await this.createNewTransaction(),
			createdOnThisLevel: true,
		};
	}

	private async wrapUpTransaction(preparedTransaction: RunningTransaction): Promise<void> {
		if (!preparedTransaction.createdOnThisLevel) return;

		await preparedTransaction.currentTransaction.transaction.commit();
	}

	private createInternalServerError(error: unknown): InternalServerException {
		if (error instanceof InternalServerException) return error;

		if (error instanceof Error) return new InternalServerException(error.message);

		return new InternalServerException("Something went wrong. Please try again!");
	}

	private async createNewTransaction(): Promise<TransactionStore> {
		return { transaction: await this.createTransaction() };
	}

	private async createTransaction(): Promise<Transaction> {
		const sequelize: Sequelize = ConfigService.getInstance().get("db");

		return sequelize.transaction();
	}
}
