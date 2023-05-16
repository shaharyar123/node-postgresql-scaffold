import { CreatedAt, DeletedAt, UpdatedAt } from "sequelize-typescript";
import type { BaseModel } from "@/core/data-access-layer/model/base.model";
import type { ModelType } from "@/core/data-access-layer/types";

export const CreatedAtColumn: PropertyDecorator = <PropertyDecorator>(<TModel extends BaseModel<TModel>>(target: TModel, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>CreatedAt, "createdAtColumnName");
});

export const UpdatedAtColumn: PropertyDecorator = <PropertyDecorator>(<TModel extends BaseModel<TModel>>(target: TModel, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>UpdatedAt, "updatedAtColumnName");
});

export const DeletedAtColumn: PropertyDecorator = <PropertyDecorator>(<TModel extends BaseModel<TModel>>(target: TModel, propertyKey: string): void => {
	ApplyTimestampDecorator(target, propertyKey, <PropertyDecorator>DeletedAt, "deletedAtColumnName");
});

export const UuidColumn: PropertyDecorator = <PropertyDecorator>(<TModel extends BaseModel<TModel>>(target: TModel, propertyKey: string): void => {
	const concreteModel: ModelType<TModel> = <ModelType<TModel>>target.constructor;
	concreteModel.uuidColumnName = propertyKey;
});

export const IsActiveColumn: PropertyDecorator = <PropertyDecorator>(<TModel extends BaseModel<TModel>>(target: TModel, propertyKey: string): void => {
	const concreteModel: ModelType<TModel> = <ModelType<TModel>>target.constructor;
	concreteModel.isActiveColumnName = propertyKey;
});

const ApplyTimestampDecorator = <TModel extends BaseModel<TModel>, TimestampKey extends "createdAtColumnName" | "updatedAtColumnName" | "deletedAtColumnName">(
	target: TModel,
	propertyKey: string,
	timestampDecorator: PropertyDecorator,
	timestampKey: TimestampKey,
): void => {
	const concreteModel: ModelType<TModel> = <ModelType<TModel>>target.constructor;
	concreteModel[timestampKey] = propertyKey;

	timestampDecorator(target, propertyKey);
};
