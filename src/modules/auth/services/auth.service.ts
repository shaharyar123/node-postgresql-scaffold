import { BaseService } from "@/core/domain/service";
import type { IRegisterRequest, TLoginRequest } from "@/modules/auth/dto";
import type { Nullable } from "@/modules/common/types";
import { UserModel } from "@/modules/user/models";
import { HashService, JwtService } from "@/modules/common/services";
import type { RunningTransaction } from "@/core/domain/types";
import { UserRepository } from "@/modules/user/repositories";
import { ModelScopes } from "@/core/dal/scopes";

export class AuthService extends BaseService {
	public async login(loginRequest: TLoginRequest): Promise<Nullable<string>> {
		const user: Nullable<UserModel> = await UserModel.findOne({ where: { userEmail: loginRequest.userEmail } });
		if (!user) return null;

		const hashService: HashService = new HashService();
		const passwordVerified: boolean = await hashService.compare(loginRequest.userPassword, user.userPassword);
		if (!passwordVerified) return null;

		const jwtService: JwtService = new JwtService();
		return jwtService.createToken(user.id.toString(), user);
	}

	public async register(registerRequest: IRegisterRequest): Promise<string | UserModel> {
		return this.executeTransactionalOperation({
			transactionCallback: async (runningTransaction: RunningTransaction): Promise<string | UserModel> => {
				const userRepository: UserRepository = new UserRepository();

				const user: Nullable<UserModel> = await userRepository.find({
					findOptions: {
						where: { userEmail: registerRequest.userEmail },
					},
					scopes: [ModelScopes.primaryKeyOnly],
				});
				if (user) return "User already exists";

				return userRepository.createOne({
					valuesToCreate: registerRequest,
					transaction: runningTransaction.currentTransaction.transaction,
				});
			},
		});
	}
}
