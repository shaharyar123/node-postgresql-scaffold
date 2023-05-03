import type { TControllerRequest, TControllerResponse } from "@/core/controller";
import { BaseController } from "@/core/controller";
import type { ILoginRequest, ILoginResponse, IRegisterRequest, IRegisterResponse } from "@/modules/auth/dto";
import { AuthService } from "@/modules/auth/services";
import type { User } from "@/modules/user/models";
import type { Nullable } from "@/modules/common/types";

export class AuthController extends BaseController {
	public async login(request: TControllerRequest<ILoginRequest, ILoginResponse>, response: TControllerResponse<ILoginResponse>): Promise<void> {
		const validated: boolean = this.validate(request, response);
		if (!validated) return;

		try {
			const authService: AuthService = new AuthService();
			const token: Nullable<string> = await authService.login(request.body);

			if (!token) {
				this.handleException(response, "Invalid Credentials", 401);
				return;
			}

			this.sendResponse("success", response, { token });
		} catch (exception) {
			this.handleException(response, exception);
		}
	}

	public async register(request: TControllerRequest<IRegisterRequest, IRegisterResponse>, response: TControllerResponse<IRegisterResponse>): Promise<void> {
		const validated: boolean = this.validate(request, response);
		if (!validated) return;

		try {
			const authService: AuthService = new AuthService();
			const user: string | User = await authService.register(request.body);

			if (typeof user === "string") {
				this.handleException(response, user, 400);
				return;
			}

			this.sendResponse("success", response, { user });
		} catch (exception) {
			this.handleException(response, exception);
		}
	}
}
