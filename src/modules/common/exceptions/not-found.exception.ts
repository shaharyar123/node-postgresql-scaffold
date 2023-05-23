import { Exception } from "@/modules/common/exceptions/exception";

export class NotFoundException extends Exception {
	public constructor(message: string) {
		super(message, 404);
	}
}
