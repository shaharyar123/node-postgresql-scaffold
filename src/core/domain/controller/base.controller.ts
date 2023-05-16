import type { TControllerRequest, TControllerResponse, TError, TFailedResponse, TPossibleFailure, TSuccessfulResponse } from "@/core/domain/types";
import type { Result, ValidationError } from "express-validator";
import { validationResult } from "express-validator";

export class BaseController {
	protected validate<T, R>(request: TControllerRequest<T, R>, response: TControllerResponse<R>): boolean {
		const errors: Result<ValidationError> = validationResult(request);
		if (errors.isEmpty()) return true;

		this.sendResponse("fail", <TControllerResponse<Array<ValidationError>>>response, errors.array(), 400);
		return false;
	}

	protected handleException<R>(response: TControllerResponse<R>, exception: unknown, code = 500): void {
		const message: string = typeof exception === "string" ? exception : "Something went wrong. Please try again!";

		this.sendResponse("fail", <TControllerResponse<TError>>response, { message }, code);
	}

	protected sendResponse<T>(status: "success", response: TControllerResponse<T>, data: T): void;
	protected sendResponse<T>(status: "success", response: TControllerResponse<T>, data: T, code: number): void;
	protected sendResponse<T extends TPossibleFailure>(status: "fail", response: TControllerResponse<T>, data: T): void;
	protected sendResponse<T extends TPossibleFailure>(status: "fail", response: TControllerResponse<T>, data: T, code: number): void;
	protected sendResponse<T>(status: "success" | "fail", response: TControllerResponse<T>, data: TPossibleFailure | T, code?: number): void {
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
