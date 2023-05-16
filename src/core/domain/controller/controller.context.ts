import type { BaseController } from "@/core/domain/controller/base.controller";
import type { Constructable, Key } from "@/modules/common/types";

export class ControllerContext {
	public static createControllerContext<T extends BaseController>(targetController: Constructable<T>): T {
		const controllerInstance: T = new targetController();

		return new Proxy(controllerInstance, {
			get(target: T, property: string): T[Key<T>] {
				const targetProp: T[Key<T>] = target[property as Key<T>];

				// noinspection SuspiciousTypeOfGuard
				if (targetProp instanceof Function) {
					return targetProp.bind(target);
				}

				return targetProp;
			},
		});
	}
}
