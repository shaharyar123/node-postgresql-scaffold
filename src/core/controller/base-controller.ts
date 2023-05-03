import type { Result, ValidationError } from "express-validator";
import { validationResult } from "express-validator";
import type { ParamsDictionary, Request } from "express-serve-static-core";
import type { TError, TFailedResponse, TPossibleFailure, TPossibleResponse, TSuccessfulResponse } from "@/core/controller/base-controller.type";

export class BaseController {
	protected validate<T, R>(request: Request<ParamsDictionary, R, T>, response: TPossibleResponse<R>): boolean {
		const errors: Result<ValidationError> = validationResult(request);
		if (errors.isEmpty()) return true;

		this.sendResponse("fail", <TPossibleResponse<Array<ValidationError>>>response, errors.array(), 400);
		return false;
	}

	protected handleException<R>(response: TPossibleResponse<R>, exception: unknown, code = 500): void {
		const message: string = typeof exception === "string" ? exception : "Something went wrong. Please try again!";

		this.sendResponse("fail", <TPossibleResponse<TError>>response, { message }, code);
	}

	protected sendResponse<T>(status: "success", response: TPossibleResponse<T>, data: T): void;
	protected sendResponse<T>(status: "success", response: TPossibleResponse<T>, data: T, code: number): void;
	protected sendResponse<T extends TPossibleFailure>(status: "fail", response: TPossibleResponse<T>, data: T): void;
	protected sendResponse<T extends TPossibleFailure>(status: "fail", response: TPossibleResponse<T>, data: T, code: number): void;
	protected sendResponse<T>(status: "success" | "fail", response: TPossibleResponse<T>, data: TPossibleFailure | T, code?: number): void {
		if (status === "success") {
			(<TSuccessfulResponse<T>>response).status(code ?? 200).json({
				data: <T>data,
				errors: null,
			});
		}

		(<TFailedResponse<TPossibleFailure>>response).status(code ?? 500).json({
			data: null,
			errors: <TPossibleFailure>data,
		});
	}
}
