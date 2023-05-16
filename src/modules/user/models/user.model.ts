import { AllowNull, AutoIncrement, BeforeCreate, BeforeUpdate, Column, DataType, Default, PrimaryKey, Scopes, Table, Unique } from "sequelize-typescript";
import type { Key, Nullable } from "@/modules/common/types";
import { HashService } from "@/modules/common/services";
import type { ModelStatic } from "sequelize";
import { v4 as uuid } from "uuid";
import { ModelScopeFactory } from "@/core/data-access-layer/scopes";
import { BaseModel, CreatedAtColumn, DeletedAtColumn, IsActiveColumn, UpdatedAtColumn, UuidColumn } from "@/core/data-access-layer/model";

@Scopes(() => ({
	...ModelScopeFactory.commonScopes(() => UserModel),
}))
@Table({ tableName: "users" })
export class UserModel extends BaseModel<UserModel> {
	@PrimaryKey
	@AutoIncrement
	@AllowNull(false)
	@Column({ type: DataType.BIGINT })
	public userId: number;

	@Unique
	@UuidColumn
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userUuid: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userFirstName: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userLastName: string;

	@Unique
	@AllowNull(false)
	@Column({ type: DataType.STRING(50) })
	public userEmail: string;

	@AllowNull(false)
	@Column({ type: DataType.STRING })
	public userPassword: string;

	@IsActiveColumn
	@Default(true)
	@AllowNull(false)
	@Column({ type: DataType.BOOLEAN })
	public userIsActive: boolean;

	@CreatedAtColumn
	public userCreatedAt: Date;

	@UpdatedAtColumn
	public userUpdatedAt: Date;

	@DeletedAtColumn
	public userDeletedAt: Nullable<Date>;

	@BeforeCreate
	@BeforeUpdate
	public static async hashPassword(userModel: UserModel): Promise<void> {
		if (!userModel.changed("userPassword")) return;

		const hashService: HashService = new HashService();
		userModel.userPassword = await hashService.hash(userModel.userPassword);
	}

	@BeforeCreate
	public static generateUuid<TModelStatic extends BaseModel<TModelStatic>>(this: ModelStatic<TModelStatic>, model: TModelStatic): void {
		if (!BaseModel.uuidColumnName) return;

		model[<Key<BaseModel<TModelStatic>>>BaseModel.uuidColumnName] = uuid();
	}
}
