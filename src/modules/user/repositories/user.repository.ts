import { UserModel } from "@/modules/user/models";
import { BaseRepository } from "@/core/domain-layer/repository";

export class UserRepository extends BaseRepository<UserModel> {
	public constructor() {
		super(UserModel);
	}
}
