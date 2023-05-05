import { BeforeCreate, BeforeUpdate, Column, DataType, Model, Table } from "sequelize-typescript";
import { HashService } from "@/modules/common/services";

@Table({ tableName: "users" })
export class User extends Model {
	@Column({
		type: DataType.BIGINT,
		allowNull: false,
		primaryKey: true,
	})
	public override id: number;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
	})
	public firstName: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
	})
	public lastName: string;

	@Column({
		type: DataType.STRING(50),
		allowNull: false,
		unique: true,
	})
	public email: string;

	@Column({
		type: DataType.STRING,
		allowNull: false,
	})
	public password: string;

	@BeforeCreate
	@BeforeUpdate
	public static async hashPassword(instance: User): Promise<void> {
		if (!instance.changed("password")) return;

		const hashService: HashService = new HashService();
		instance.password = await hashService.hash(instance.password);
	}
}
