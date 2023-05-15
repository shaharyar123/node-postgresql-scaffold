export type IConfig<T> = {
	exportConfig(): T | Promise<T>;
};
