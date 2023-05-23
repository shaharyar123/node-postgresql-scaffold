import type { BaseModel } from "@/core/data-access-layer/model";
import type { AvailableScopes, ModelType } from "@/core/data-access-layer/types";
import { ModelScopes } from "@/core/data-access-layer/scopes/model.scopes";

export class ModelScopeFactory<TModel extends BaseModel<TModel>> {
	private constructor(private model: ModelType<TModel>, private scopes: AvailableScopes = {}) {}

	public static commonScopes<TModelStatic extends BaseModel<TModelStatic>>(modelCallback: () => typeof BaseModel<TModelStatic>): AvailableScopes {
		const modelGetterCallback = modelCallback as () => ModelType<TModelStatic>;
		const scopesInstance: ModelScopeFactory<TModelStatic> = new ModelScopeFactory(modelGetterCallback());

		scopesInstance
			// Handle scope logic according to their business in separate methods
			.preparePrimaryKeyScopes()
			.prepareUuidKeyScopes()
			.prepareTimestampsScopes()
			.prepareActiveColumnScopes();

		return scopesInstance.scopes;
	}

	private preparePrimaryKeyScopes(): ModelScopeFactory<TModel> {
		this.scopes[ModelScopes.primaryKeyOnly] = { attributes: [this.model.primaryKeyAttribute] };

		return this;
	}

	private prepareUuidKeyScopes(): ModelScopeFactory<TModel> {
		if (!this.model.uuidColumnName) return this;

		this.scopes[ModelScopes.primaryKeyAndUuidOnly] = {
			attributes: [this.model.primaryKeyAttribute, this.model.uuidColumnName],
		};

		return this;
	}

	private prepareTimestampsScopes(): ModelScopeFactory<TModel> {
		const availableTimestamps: Array<string> = [];

		if (this.model.createdAtColumnName) availableTimestamps.push(this.model.createdAtColumnName);
		if (this.model.updatedAtColumnName) availableTimestamps.push(this.model.updatedAtColumnName);
		if (this.model.deletedAtColumnName) availableTimestamps.push(this.model.deletedAtColumnName);

		if (availableTimestamps.length) this.scopes[ModelScopes.withoutTimestamps] = { attributes: { exclude: availableTimestamps } };

		return this;
	}

	private prepareActiveColumnScopes(): ModelScopeFactory<TModel> {
		if (this.model.isActiveColumnName) this.scopes[ModelScopes.isActive] = { where: { [this.model.isActiveColumnName]: true } };

		return this;
	}
}
