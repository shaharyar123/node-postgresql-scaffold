import type { Constructable, Key } from "@/modules/common/types";
import type { BaseController } from "@/core/controller/base-controller";

export class ControllerContext {
	public static createControllerContext<T extends BaseController>(targetController: Constructable<T>): T {
		const controllerInstance: T = new targetController();

		return new Proxy(controllerInstance, {
			get(target: T, property: string): T[Key<T>] {
				const targetMethod: CallableFunction = <CallableFunction>target[<Key<T>>property];
				return <T[Key<T>]>targetMethod.bind(target);
			},
		});
	}
}
