import { User } from "@/modules/user/models";
import { HashService, JwtService } from "@/modules/common/services";
import type { ILoginRequest, IRegisterRequest } from "@/modules/auth/dto";
import type { Nullable } from "@/modules/common/types";

export class AuthService {
	public async login(loginRequest: ILoginRequest): Promise<Nullable<string>> {
		const user: Nullable<User> = await User.findOne({ where: { email: loginRequest.email } });
		if (!user) return null;

		const hashService: HashService = new HashService();
		const passwordVerified: boolean = await hashService.compare(loginRequest.password, user.password);
		if (!passwordVerified) return null;

		const jwtService: JwtService = new JwtService();
		return jwtService.createToken(user.id, user);
	}

	public async register(registerRequest: IRegisterRequest): Promise<string | User> {
		const user: Nullable<User> = await User.findOne({ where: { email: registerRequest.email } });
		if (user) return "User already exists";

		return User.create(registerRequest);
	}
}
