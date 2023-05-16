import type { ModelScope } from "@/core/data-access-layer/types";
import { Model } from "sequelize-typescript";
import type { ModelStatic } from "sequelize";

export class BaseModel<TModel extends BaseModel<TModel>> extends Model<TModel> {
	// Table & Column Name Information
	public static uuidColumnName: string;
	public static isActiveColumnName: string;

	// Column Exposure Information
	public static readonly exposePrimaryKey = false;
	public static readonly exposeForeignKeys: Array<string> = [];

	// Timestamps Information
	public static createdAtColumnName: string;
	public static updatedAtColumnName: string;
	public static deletedAtColumnName: string;

	public static applyScopes<TModelStatic extends BaseModel<TModelStatic>>(this: ModelStatic<TModelStatic>, providedScopes?: ModelScope): ModelStatic<TModelStatic> {
		let scopesToApply: ModelScope = ["defaultScope"];

		if (providedScopes) scopesToApply = scopesToApply.concat(providedScopes);

		return this.scope(scopesToApply);
	}

	public removeDataValue(this: TModel, key: keyof TModel): void {
		this.changed(key, true);

		delete this.dataValues[key];
	}
}
