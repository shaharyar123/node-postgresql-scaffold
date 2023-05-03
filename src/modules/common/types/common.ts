export type Key<T> = keyof T;

export type Optional<T> = undefined | T;

export type Nullable<T> = null | T;

export type NullableOptional<T> = Optional<T> | Nullable<T>;

export type Constructable<T, TArgs extends Array<void> = Array<void>> = new (...args: TArgs) => T;
