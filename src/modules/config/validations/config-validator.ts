import type { Optional } from "@/modules/common/types";

export class ConfigValidator {
	public static toBoolean(configValue: string): boolean {
		return configValue === "true";
	}

	public static toNumber(configValue: string): number {
		return +configValue;
	}

	public static assertPresent<T>(configValue: Optional<T>): T {
		return configValue as T;
	}

	public static assertValueIn<T, R extends T = T>(configValue: T, configValuePossibleOptions: Array<T>): R {
		if (configValuePossibleOptions.includes(configValue)) {
			return configValue as R;
		}

		throw new Error(`${ configValue } is not one of ${ configValuePossibleOptions.join(", ") }`);
	}
}
