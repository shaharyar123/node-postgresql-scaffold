import type { AppException } from "@/modules/common/types";

export class Exception extends Error {
	public constructor(public override readonly message: string, private readonly code: number) {
		super(message);
	}

	public toError(): AppException {
		return {
			code: this.code,
			message: this.message,
		};
	}
}
