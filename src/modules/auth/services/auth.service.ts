import type { TLoginRequest, TRegisterRequest } from "@/modules/auth/dto";
import type { Nullable } from "@/modules/common/types";
import type { UserModel } from "@/modules/user/models";
import { HashService, JwtService } from "@/modules/common/services";
import { UserRepository } from "@/modules/user/repositories";
import { BaseService } from "@/core/domain-layer/service";
import type { RunningTransaction } from "@/core/domain-layer/types";
import { ModelScopes } from "@/core/data-access-layer/scopes";

export class AuthService extends BaseService {
	public async login(loginRequest: TLoginRequest): Promise<Nullable<string>> {
		const userRepository: UserRepository = new UserRepository();
		const user: Nullable<UserModel> = await userRepository.find({
			findOptions: {
				attributes: ["userId", "userUuid", "userPassword"],
				where: { userEmail: loginRequest.userEmail },
			},
		});
		if (!user) return null;

		const hashService: HashService = new HashService();
		const passwordVerified: boolean = await hashService.compare(loginRequest.userPassword, user.userPassword);
		if (!passwordVerified) return null;

		const jwtService: JwtService = new JwtService();
		return jwtService.createToken(user.userUuid.toString(), user);
	}

	public async register(registerRequest: TRegisterRequest): Promise<string | UserModel> {
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
