import type { BaseModel } from "@/core/data-access-layer/model";
import type { ModelKeyValues, ModelScope, ModelType } from "@/core/data-access-layer/types";
import type { CreateManyOptions, CreateOneOptions, CreateOrUpdateOptions, DeleteOptions, FindOrCreateOptions, ModelResolution, ScopedFinderOptions, UpdateOptions } from "@/core/domain-layer/types";
import type { Nullable } from "@/modules/common/types";
import { InternalServerException, NotFoundException } from "@/modules/common/exceptions";
import type { CreationAttributes, WhereOptions } from "sequelize";
import { DefaultScopedFindOptions } from "@/core/domain-layer/repository/base.repository.defaults";

export class BaseRepository<TModel extends BaseModel<TModel>> {
	protected constructor(protected readonly concreteModel: ModelType<TModel>) {}

	public async find(findOptions: ScopedFinderOptions<TModel>): Promise<Nullable<TModel>> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteModel.applyScopes<TModel>(findOptions.scopes).findOne<TModel>(findOptions.findOptions);
	}

	public async findOrFail(findOptions: ScopedFinderOptions<TModel>): Promise<TModel> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		const foundModel: Nullable<TModel> = await this.find(findOptions);

		if (foundModel) return foundModel;

		throw new NotFoundException(`${this.concreteModel.name} with key value pairs ${JSON.stringify(findOptions.findOptions)} not found!`);
	}

	public async findAll(findOptions: ScopedFinderOptions<TModel>): Promise<Array<TModel>> {
		findOptions = this.providedOrDefaultScopedFindOptions(findOptions);

		return await this.concreteModel.applyScopes<TModel>(findOptions.scopes).findAll<TModel>(findOptions.findOptions);
	}

	public async resolve(model: ModelResolution<TModel>, scopes?: ModelScope): Promise<Nullable<TModel>> {
		if (typeof model !== "string" && typeof model !== "number") return model;

		const scopedFindOptions: ScopedFinderOptions<TModel> = this.providedOrDefaultScopedFindOptions({ scopes });

		if (typeof model === "string") {
			if (!this.concreteModel.uuidColumnName) throw new InternalServerException(`Uuid column name not defined on ${this.concreteModel.name}`);

			scopedFindOptions.findOptions = { where: { [this.concreteModel.uuidColumnName]: model } as WhereOptions<TModel> };
			return await this.find(scopedFindOptions);
		}

		scopedFindOptions.findOptions = { where: { [this.concreteModel.primaryKeyAttribute]: model } as WhereOptions<TModel> };
		return await this.find(scopedFindOptions);
	}

	public async resolveOrFail(model: ModelResolution<TModel>, scopes?: ModelScope): Promise<TModel> {
		const foundModel: Nullable<TModel> = await this.resolve(model, scopes);

		if (foundModel) return foundModel;

		throw new NotFoundException(`${this.concreteModel.name} not resolved with identifier ${model}`);
	}

	public async createOne(createOptions: CreateOneOptions<TModel>): Promise<TModel> {
		const { valuesToCreate, transaction }: CreateOneOptions<TModel> = createOptions;

		return await this.concreteModel.create<TModel>(valuesToCreate as CreationAttributes<TModel>, { transaction });
	}

	public async createMany(createOptions: CreateManyOptions<TModel>): Promise<Array<TModel>> {
		const { valuesToCreate, transaction }: CreateManyOptions<TModel> = createOptions;

		return await this.concreteModel.bulkCreate<TModel>(valuesToCreate as Array<CreationAttributes<TModel>>, { transaction });
	}

	public async update(updateOptions: UpdateOptions<TModel>): Promise<TModel> {
		const { scopes, transaction }: UpdateOptions<TModel> = updateOptions;

		const foundModel: TModel =
			"findOptions" in updateOptions
				? await this.findOrFail({
						findOptions: updateOptions.findOptions,
						scopes,
				  })
				: await this.resolveOrFail(updateOptions.model, scopes);

		return foundModel.update(updateOptions.valuesToUpdate as ModelKeyValues<TModel>, { transaction });
	}

	public async findOrCreate(findOrCreateOptions: FindOrCreateOptions<TModel>): Promise<TModel> {
		if ("model" in findOrCreateOptions && findOrCreateOptions.model) {
			const foundModel: Nullable<TModel> = await this.resolve(findOrCreateOptions.model, findOrCreateOptions.scopes);

			if (foundModel) return foundModel;
		}

		if ("findOptions" in findOrCreateOptions && findOrCreateOptions.findOptions) {
			const foundModel: Nullable<TModel> = await this.find({
				findOptions: findOrCreateOptions.findOptions,
				scopes: findOrCreateOptions.scopes,
			});

			if (foundModel) return foundModel;
		}

		return await this.createOne({
			transaction: findOrCreateOptions.transaction,
			valuesToCreate: findOrCreateOptions.valuesToCreate,
		});
	}

	public async updateOrCreate(createOrUpdateOptions: CreateOrUpdateOptions<TModel>): Promise<TModel> {
		if ("model" in createOrUpdateOptions && createOrUpdateOptions.model) {
			const foundModel: Nullable<TModel> = await this.resolve(createOrUpdateOptions.model, createOrUpdateOptions.scopes);

			if (foundModel) return await foundModel.update(createOrUpdateOptions.valuesToUpdate as ModelKeyValues<TModel>, { transaction: createOrUpdateOptions.transaction });
		}

		if ("findOptions" in createOrUpdateOptions && createOrUpdateOptions.findOptions) {
			const foundModel: Nullable<TModel> = await this.find({
				findOptions: createOrUpdateOptions.findOptions,
				scopes: createOrUpdateOptions.scopes,
			});

			if (foundModel) return await foundModel.update(createOrUpdateOptions.valuesToUpdate as ModelKeyValues<TModel>, { transaction: createOrUpdateOptions.transaction });
		}

		return await this.createOne({
			transaction: createOrUpdateOptions.transaction,
			valuesToCreate: { ...createOrUpdateOptions.valuesToCreate, ...createOrUpdateOptions.valuesToUpdate },
		});
	}

	public async delete(deleteOptions: DeleteOptions<TModel>): Promise<boolean> {
		if ("findOptions" in deleteOptions) {
			const foundModel: Nullable<TModel> = await this.find({
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

		const foundModel: Nullable<TModel> = await this.resolve(deleteOptions.model, deleteOptions.scopes);
		if (!foundModel) return false;

		await foundModel.destroy({
			transaction: deleteOptions.transaction,
			force: deleteOptions.force ?? false,
		});
		return true;
	}

	private providedOrDefaultScopedFindOptions(findOptions?: Partial<ScopedFinderOptions<TModel>>): ScopedFinderOptions<TModel> {
		const scopedModelFindOptions: Partial<ScopedFinderOptions<TModel>> = findOptions ?? DefaultScopedFindOptions;

		scopedModelFindOptions.scopes = scopedModelFindOptions.scopes ?? DefaultScopedFindOptions.scopes;
		scopedModelFindOptions.findOptions = scopedModelFindOptions.findOptions ?? DefaultScopedFindOptions.findOptions;

		return findOptions as ScopedFinderOptions<TModel>;
	}
}
