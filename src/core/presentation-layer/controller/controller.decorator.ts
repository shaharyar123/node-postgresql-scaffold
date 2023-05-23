import type { Constructable, Key } from "@/modules/common/types";
import type { BaseController } from "@/core/presentation-layer/controller/base.controller";

export const Controller = <T extends BaseController>(target: Constructable<T>): Constructable<T> => {
	return new Proxy(target, {
		construct(constructableController: Constructable<T>, argumentsArray: Array<void>): T {
			const controllerInstance: T = Reflect.construct(constructableController, argumentsArray);

			return new Proxy(controllerInstance, {
				get(controller: T, property: string): T[Key<T>] {
					const targetProp: T[Key<T>] = Reflect.get(controller, property);

					// noinspection SuspiciousTypeOfGuard
					if (targetProp instanceof Function) {
						return targetProp.bind(controller);
					}

					return targetProp;
				},
			});
		},
	});
};
