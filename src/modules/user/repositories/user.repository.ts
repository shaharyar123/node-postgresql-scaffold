import { BaseRepository } from "@/core/dal/repository";
import { UserModel } from "@/modules/user/models";

export class UserRepository extends BaseRepository<UserModel> {
	public constructor() {
		super(UserModel);
	}
}