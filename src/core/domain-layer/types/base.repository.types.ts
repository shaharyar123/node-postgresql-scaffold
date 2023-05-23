import type { BaseModel } from "@/core/data-access-layer/model";
import type { FindOptions, Transaction } from "sequelize";
import type { ModelScope, ModelTableColumnProperties } from "@/core/data-access-layer/types";

export type ModelResolution<TModel extends BaseModel<TModel>> = TModel | string | number;

export type Transactional = {
	transaction: Transaction;
};

export type Scoped = {
	scopes: ModelScope;
};

export type FinderOptions<TModel extends BaseModel<TModel>> = {
	findOptions: FindOptions<TModel>;
};

export type ScopedFinderOptions<TModel extends BaseModel<TModel>> = Partial<Scoped> & FinderOptions<TModel>;

export type ResolverOptions<TModel extends BaseModel<TModel>> = {
	model: ModelResolution<TModel>;
};

export type ScopedFinderOrResolverOption<TModel extends BaseModel<TModel>> = Partial<Scoped> & (FinderOptions<TModel> | ResolverOptions<TModel>);

export type CreateOneOptions<TModel extends BaseModel<TModel>> = {
	valuesToCreate: Partial<ModelTableColumnProperties<TModel>>;
} & Transactional;

export type CreateManyOptions<TModel extends BaseModel<TModel>> = {
	valuesToCreate: Array<Partial<ModelTableColumnProperties<TModel>>>;
} & Transactional;

export type UpdateBaseOptions<TModel extends BaseModel<TModel>> = {
	valuesToUpdate: Partial<ModelTableColumnProperties<TModel>>;
} & Transactional;

export type DeleteBaseOptions = {
	force?: boolean;
} & Transactional;

export type FindOrCreateOptions<TModel extends BaseModel<TModel>> = Partial<ScopedFinderOrResolverOption<TModel>> & CreateOneOptions<TModel>;

export type CreateOrUpdateOptions<TModel extends BaseModel<TModel>> = Partial<ScopedFinderOrResolverOption<TModel>> & UpdateBaseOptions<TModel> & CreateOneOptions<TModel>;

export type UpdateOptions<TModel extends BaseModel<TModel>> = ScopedFinderOrResolverOption<TModel> & UpdateBaseOptions<TModel>;

export type DeleteOptions<TModel extends BaseModel<TModel>> = ScopedFinderOrResolverOption<TModel> & DeleteBaseOptions;
