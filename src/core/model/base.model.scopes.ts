import { BaseModelDefaultScopes } from "@/core/model/base.model.default-scopes";
import type { BaseModel } from "@/core/model/base.model";
import type { AvailableScopes, ModelType } from "@/core/model/base.model.types";

export class BaseModelScopes<TModel extends BaseModel<TModel>> {
	private constructor(private model: ModelType<TModel>, private scopes: AvailableScopes = {}) {}

	public static commonScopes<TModelStatic extends BaseModel<TModelStatic>>(modelCallback: () => typeof BaseModel<TModelStatic>): AvailableScopes {
		const modelGetterCallback = modelCallback as () => ModelType<TModelStatic>;
		const scopesInstance: BaseModelScopes<TModelStatic> = new BaseModelScopes(modelGetterCallback());

		scopesInstance
			// Handle scope logic according to their business in separate methods
			.preparePrimaryKeyScopes()
			.prepareUuidKeyScopes()
			.prepareTimestampsScopes()
			.prepareActiveColumnScopes();

		return scopesInstance.scopes;
	}

	private preparePrimaryKeyScopes(): BaseModelScopes<TModel> {
		this.scopes[BaseModelDefaultScopes.primaryKeyOnly] = { attributes: [this.model.primaryKeyAttribute] };

		return this;
	}

	private prepareUuidKeyScopes(): BaseModelScopes<TModel> {
		if (!this.model.uuidColumnName) return this;

		this.scopes[BaseModelDefaultScopes.primaryKeyAndUuidOnly] = {
			attributes: [this.model.primaryKeyAttribute, this.model.uuidColumnName],
		};

		return this;
	}

	private prepareTimestampsScopes(): BaseModelScopes<TModel> {
		const availableTimestamps: Array<string> = [];

		if (this.model.createdAtColumnName) availableTimestamps.push(this.model.createdAtColumnName);
		if (this.model.updatedAtColumnName) availableTimestamps.push(this.model.updatedAtColumnName);
		if (this.model.deletedAtColumnName) availableTimestamps.push(this.model.deletedAtColumnName);

		if (availableTimestamps.length) this.scopes[BaseModelDefaultScopes.withoutTimestamps] = { attributes: { exclude: availableTimestamps } };

		return this;
	}

	private prepareActiveColumnScopes(): BaseModelScopes<TModel> {
		if (this.model.isActiveColumnName) this.scopes[BaseModelDefaultScopes.isActive] = { where: { [this.model.isActiveColumnName]: true } };

		return this;
	}
}
