import type { ModelKeyValues, ModelScope, ModelType } from "@/core/model";
import { BaseModel } from "@/core/model";
import type {
	ModelCreateOrUpdateOptions,
	ModelDeleteOptions,
	ModelFindOrCreateOptions,
	ModelResolution,
	MultipleModelCreateOptions,
	MultipleModelUpdateOptions,
	ScopedFindOptions,
	SingleModelCreateOptions,
	SingleModelUpdateOptions,
} from "@/core/repository/base.repository.types";
import type { Key, Nullable } from "@/modules/common/types";
import { NotFoundException } from "@/modules/common/exceptions";
import type { CreationAttributes, WhereOptions } from "sequelize";
import { DefaultScopedFindOptions } from "@/core/repository/base.repository.defaults";

export class BaseRepository<TModel extends BaseModel<TModel>> {
	protected constructor(protected readonly concreteModel: ModelType<TModel>) {}

	public async findModel(findOptions: ScopedFindOptions<TModel>): Promise<Nullable<TModel>> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteModel.applyScopes<TModel>(findOptions.scopes).findOne<TModel>(findOptions.findOptions);
	}

	public async findModels(findOptions: ScopedFindOptions<TModel>): Promise<Array<TModel>> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteModel.applyScopes<TModel>(findOptions.scopes).findAll<TModel>(findOptions.findOptions);
	}

	public async findOrFailModel(findOptions: ScopedFindOptions<TModel>): Promise<TModel> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		const foundModel: Nullable<TModel> = await this.findModel(findOptions);

		if (foundModel) return foundModel;

		throw new NotFoundException(`${this.concreteModel.name} with key value pairs ${JSON.stringify(findOptions.findOptions)} not found!`);
	}

	public async resolveModel(model: ModelResolution<TModel>, scopes?: ModelScope): Promise<Nullable<TModel>> {
		if (typeof model !== "string" && typeof model !== "number") return model;

		const scopedFindOptions: ScopedFindOptions<TModel> = this.providedOrDefaultScopedFindOptions({ scopes });

		if (typeof model === "string") {
			if (!this.concreteModel.uuidColumnName) throw new Error(`Uuid column name not defined on ${this.concreteModel.name}`);

			scopedFindOptions.findOptions = { where: { [this.concreteModel.uuidColumnName]: model } as WhereOptions<TModel> };
			return await this.findModel(scopedFindOptions);
		}

		scopedFindOptions.findOptions = { where: { [this.concreteModel.primaryKeyAttribute]: model } as WhereOptions<TModel> };
		return await this.findModel(scopedFindOptions);
	}

	public async resolveModels(models: Array<ModelResolution<TModel>>, scopes?: ModelScope): Promise<Array<TModel>> {
		if (this.isModelArray(models)) return models;

		const scopedFindOptions: ScopedFindOptions<TModel> = this.providedOrDefaultScopedFindOptions({ scopes });

		if (this.isUuidArray(models)) {
			if (!this.concreteModel.uuidColumnName) throw new Error(`Uuid column name not defined on ${this.concreteModel.name}`);

			scopedFindOptions.findOptions = { where: { [this.concreteModel.uuidColumnName]: models } as WhereOptions<TModel> };
			return await this.findModels(scopedFindOptions);
		}

		scopedFindOptions.findOptions = { where: { [this.concreteModel.primaryKeyAttribute]: models } as WhereOptions<TModel> };
		return await this.findModels(scopedFindOptions);
	}

	public async resolveOrFailModel(model: ModelResolution<TModel>, scopes?: ModelScope): Promise<TModel> {
		const foundModel: Nullable<TModel> = await this.resolveModel(model, scopes);

		if (foundModel) return foundModel;

		throw new NotFoundException(`${this.concreteModel.name} not resolved with identifier ${model}`);
	}

	public async createSingleModel(createOptions: SingleModelCreateOptions<TModel>): Promise<TModel> {
		const { valuesToCreate, transaction }: SingleModelCreateOptions<TModel> = createOptions;

		return await this.concreteModel.create<TModel>(valuesToCreate as CreationAttributes<TModel>, { transaction });
	}

	public async createMultipleModels(createOptions: MultipleModelCreateOptions<TModel>): Promise<Array<TModel>> {
		const { valuesToCreate, transaction }: MultipleModelCreateOptions<TModel> = createOptions;

		return await this.concreteModel.bulkCreate<TModel>(valuesToCreate as Array<CreationAttributes<TModel>>, { transaction });
	}

	public async updateSingleModel(updateOptions: SingleModelUpdateOptions<TModel>): Promise<TModel> {
		const { scopes, transaction }: SingleModelUpdateOptions<TModel> = updateOptions;

		const foundModel: TModel =
			"findOptions" in updateOptions
				? await this.findOrFailModel({
						findOptions: updateOptions.findOptions,
						scopes,
				  })
				: await this.resolveOrFailModel(updateOptions.model, scopes);

		return foundModel.update(updateOptions.valuesToUpdate as ModelKeyValues<TModel>, { transaction });
	}

	public async updateMultipleModels(updateOptions: MultipleModelUpdateOptions<TModel>): Promise<Array<TModel>> {
		const { scopes, transaction }: MultipleModelUpdateOptions<TModel> = updateOptions;

		const foundModels: Array<TModel> =
			"findOptions" in updateOptions
				? await this.findModels({
						findOptions: updateOptions.findOptions,
						scopes,
				  })
				: await this.resolveModels(updateOptions.models, scopes);

		const foundModelsPrimaryKeys: Array<TModel[Key<TModel>]> = foundModels.map((foundModel: TModel) => foundModel[this.concreteModel.primaryKeyAttribute as Key<TModel>]);

		const [, updatedModels]: [affectedCount: number, affectedRows: Array<TModel>] = await this.concreteModel.update<TModel>(updateOptions.valuesToUpdate as ModelKeyValues<TModel>, {
			where: { [this.concreteModel.primaryKeyAttribute]: foundModelsPrimaryKeys } as WhereOptions<TModel>,
			returning: true,
			transaction,
		});

		return updatedModels;
	}

	public async findOrCreateModel(findOrCreateOptions: ModelFindOrCreateOptions<TModel>): Promise<TModel> {
		if ("model" in findOrCreateOptions && findOrCreateOptions.model) {
			const foundModel: Nullable<TModel> = await this.resolveModel(findOrCreateOptions.model, findOrCreateOptions.scopes);

			if (foundModel) return foundModel;
		}

		if ("findOptions" in findOrCreateOptions && findOrCreateOptions.findOptions) {
			const foundModel: Nullable<TModel> = await this.findModel({
				findOptions: findOrCreateOptions.findOptions,
				scopes: findOrCreateOptions.scopes,
			});

			if (foundModel) return foundModel;
		}

		return await this.createSingleModel({
			transaction: findOrCreateOptions.transaction,
			valuesToCreate: findOrCreateOptions.valuesToCreate,
		});
	}

	public async updateOrCreateModel(createOrUpdateOptions: ModelCreateOrUpdateOptions<TModel>): Promise<TModel> {
		if ("model" in createOrUpdateOptions && createOrUpdateOptions.model) {
			const foundModel: Nullable<TModel> = await this.resolveModel(createOrUpdateOptions.model, createOrUpdateOptions.scopes);

			if (foundModel) return await foundModel.update(createOrUpdateOptions.valuesToUpdate as ModelKeyValues<TModel>, { transaction: createOrUpdateOptions.transaction });
		}

		if ("findOptions" in createOrUpdateOptions && createOrUpdateOptions.findOptions) {
			const foundModel: Nullable<TModel> = await this.findModel({
				findOptions: createOrUpdateOptions.findOptions,
				scopes: createOrUpdateOptions.scopes,
			});

			if (foundModel) return await foundModel.update(createOrUpdateOptions.valuesToUpdate as ModelKeyValues<TModel>, { transaction: createOrUpdateOptions.transaction });
		}

		return await this.createSingleModel({
			transaction: createOrUpdateOptions.transaction,
			valuesToCreate: { ...createOrUpdateOptions.valuesToCreate, ...createOrUpdateOptions.valuesToUpdate },
		});
	}

	public async deleteModel(deleteOptions: ModelDeleteOptions<TModel>): Promise<boolean> {
		if ("findOptions" in deleteOptions) {
			const foundModel: Nullable<TModel> = await this.findModel({
				findOptions: deleteOptions.findOptions,
				scopes: deleteOptions.scopes,
			});
			if (!foundModel) return false;

			await foundModel.destroy({
				transaction: deleteOptions.transaction,
				force: deleteOptions.force ?? false,
			});
			return true;
		}

		const foundModel: Nullable<TModel> = await this.resolveModel(deleteOptions.model, deleteOptions.scopes);
		if (!foundModel) return false;

		await foundModel.destroy({
			transaction: deleteOptions.transaction,
			force: deleteOptions.force ?? false,
		});
		return true;
	}

	private providedOrDefaultScopedFindOptions(findOptions?: Partial<ScopedFindOptions<TModel>>): ScopedFindOptions<TModel> {
		const scopedModelFindOptions: Partial<ScopedFindOptions<TModel>> = findOptions ?? DefaultScopedFindOptions;

		scopedModelFindOptions.scopes = scopedModelFindOptions.scopes ?? DefaultScopedFindOptions.scopes;
		scopedModelFindOptions.findOptions = scopedModelFindOptions.findOptions ?? DefaultScopedFindOptions.findOptions;

		return findOptions as ScopedFindOptions<TModel>;
	}

	private isUuidArray(models: Array<ModelResolution<TModel>>): models is Array<string> {
		return models.every((model: ModelResolution<TModel>): boolean => typeof model === "string");
	}

	private isModelArray(models: Array<ModelResolution<TModel>>): models is Array<TModel> {
		return models.every((model: ModelResolution<TModel>): boolean => model instanceof BaseModel<TModel>);
	}
}
