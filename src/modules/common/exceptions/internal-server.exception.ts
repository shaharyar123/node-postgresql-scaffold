import { Exception } from "@/modules/common/exceptions/exception";

export class InternalServerException extends Exception {
	public constructor(message: string) {
		super(message, 500);
	}
}
