import type { Response } from "express-serve-static-core";
import type { ParamsDictionary, Request } from "express-serve-static-core";
import type { ValidationError } from "express-validator";

export type TSuccess<T> = {
	data: T;
	errors: null;
};

export type TFail<E> = {
	data: null;
	errors: E;
};

export type TError = {
	message: string;
};

export type TSuccessfulResponse<T> = Response<TSuccess<T>>;
export type TFailedResponse<E> = Response<TFail<E>>;
export type TResponse<T, E> = TSuccessfulResponse<T> | TFailedResponse<E>;

export type TPossibleFailure = Array<ValidationError> | TError;

export type TControllerRequest<T, R> = Request<ParamsDictionary, R, T>;
export type TControllerResponse<T> = TResponse<T, TPossibleFailure>;
