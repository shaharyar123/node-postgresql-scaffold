import type { FindOptions, Transaction } from "sequelize";
import type { BaseModel, ModelScope, ModelTableColumnProperties } from "@/core/model";

export type ModelResolution<TModel extends BaseModel<TModel>> = TModel | string | number;

export type Transactional = {
	transaction: Transaction;
};

export type Scoped = {
	scopes: ModelScope;
};

export type ScopedFindOptions<TModel extends BaseModel<TModel>> = {
	findOptions: FindOptions<TModel>;
} & Partial<Scoped>;

export type ModelFinderOptions<TModel extends BaseModel<TModel>> = {
	findOptions: FindOptions<TModel>;
};

export type SingleModelResolverOptions<TModel extends BaseModel<TModel>> = {
	model: ModelResolution<TModel>;
};

export type MultiModelResolverOptions<TModel extends BaseModel<TModel>> = {
	models: Array<ModelResolution<TModel>>;
};

export type SingleModelFinderOrResolverOption<TModel extends BaseModel<TModel>> = SingleModelResolverOptions<TModel> | ModelFinderOptions<TModel>;

export type MultiModelFinderOrResolverOption<TModel extends BaseModel<TModel>> = MultiModelResolverOptions<TModel> | ModelFinderOptions<TModel>;

export type ModelUpdateBaseOptions<TModel extends BaseModel<TModel>> = {
	valuesToUpdate: Partial<ModelTableColumnProperties<TModel>>;
} & Transactional &
	Partial<Scoped>;

export type ModelFindOrCreateOptions<TModel extends BaseModel<TModel>> = Partial<SingleModelFinderOrResolverOption<TModel>> & Partial<Scoped> & SingleModelCreateOptions<TModel>;

export type SingleModelCreateOptions<TModel extends BaseModel<TModel>> = {
	valuesToCreate: Partial<ModelTableColumnProperties<TModel>>;
} & Transactional;

export type MultipleModelCreateOptions<TModel extends BaseModel<TModel>> = {
	valuesToCreate: Array<Partial<ModelTableColumnProperties<TModel>>>;
} & Transactional;

export type SingleModelUpdateOptions<TModel extends BaseModel<TModel>> = SingleModelFinderOrResolverOption<TModel> & ModelUpdateBaseOptions<TModel>;

export type MultipleModelUpdateOptions<TModel extends BaseModel<TModel>> = MultiModelFinderOrResolverOption<TModel> & ModelUpdateBaseOptions<TModel>;

export type ModelCreateOrUpdateOptions<TModel extends BaseModel<TModel>> = SingleModelCreateOptions<TModel> & Partial<SingleModelFinderOrResolverOption<TModel>> & ModelUpdateBaseOptions<TModel>;

export type ModelDeleteBaseOptions = {
	force?: boolean;
} & Transactional &
	Partial<Scoped>;

export type ModelDeleteOptions<TModel extends BaseModel<TModel>> = SingleModelFinderOrResolverOption<TModel> & ModelDeleteBaseOptions;
