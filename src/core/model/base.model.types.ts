/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ScopeOptions } from "sequelize";
import type { ScopesOptions } from "sequelize-typescript";
import type { BaseModel } from "@/core/model/base.model";
import type { BaseModelDefaultScopes } from "@/core/model/base.model.default-scopes";
import type { Constructable, FilterWhereNot, Key, Nullable } from "@/modules/common/types";

export type ModelScope = Array<string | ScopeOptions>;

export type ModelRelationshipPropertyTypes = Nullable<BaseModel<any>> | BaseModel<any> | Array<BaseModel<any>>;

export type ModelKeyValues<TModel extends BaseModel<TModel>> = { [TProp in Key<TModel>]: TModel[TProp] };

export type BaseModelKeyValues<TModel extends BaseModel<TModel>> = { [TProp in Key<BaseModel<TModel>>]: BaseModel<TModel>[TProp] };

export type ModelProperties<TModel extends BaseModel<TModel>> = Omit<ModelKeyValues<TModel>, Key<BaseModelKeyValues<TModel>>>;

export type ModelNonTableColumnProperties = ModelRelationshipPropertyTypes | ((...params: any) => any);

export type ModelTableColumnProperties<TModel extends BaseModel<TModel>> = FilterWhereNot<ModelProperties<TModel>, ModelNonTableColumnProperties>;

export type Relationship<TModel extends BaseModel<TModel>> = {
	propertyKey: string;
	modelOrModels: BaseModel<TModel> | Array<BaseModel<TModel>>;
};

export type AvailableScopes = Record<(typeof BaseModelDefaultScopes)[keyof typeof BaseModelDefaultScopes], ScopesOptions>;

export type ModelType<TModel extends BaseModel<TModel>> = Constructable<TModel, any> & typeof BaseModel<TModel>;
