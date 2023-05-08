import type { JWTPayload, JWTVerifyResult } from "jose";
import { jwtVerify, SignJWT } from "jose";
import { randomBytes } from "crypto";
import { ConfigService } from "@/modules/config/services";
import type { TAppConfig, TJwtConfig } from "@/modules/config/config";

export class JwtService {
	public async createToken<T>(subject: string, payload: T): Promise<string> {
		const jwtPayload: JWTPayload = { data: payload };
		const jwtIdentifier: string = randomBytes(20).toString();
		const secret: Uint8Array = this.encodeSecret();
		const jwtConfig: TJwtConfig = ConfigService.getInstance().get("jwt");

		return new SignJWT(jwtPayload).setSubject(subject).setProtectedHeader({ alg: "HS512" }).setJti(jwtIdentifier).setIssuedAt().setExpirationTime(jwtConfig.expiresIn).sign(secret);
	}

	public async verifyToken<T>(token: string): Promise<T> {
		const secret: Uint8Array = this.encodeSecret();

		const {
			payload: { data },
		}: JWTVerifyResult = await jwtVerify(token, secret);

		return <T>data;
	}

	private encodeSecret(): Uint8Array {
		const appConfig: TAppConfig = ConfigService.getInstance().get("app");
		return new TextEncoder().encode(appConfig.key);
	}
}
