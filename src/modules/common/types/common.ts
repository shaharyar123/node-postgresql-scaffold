/* eslint-disable @typescript-eslint/no-explicit-any */
export type Key<T> = keyof T;

export type Optional<T> = undefined | T;

export type Nullable<T> = null | T;

export type Constructable<T, TArgs extends Array<unknown> = Array<void>> = new (...args: TArgs) => T;

export type InverseFilterCondition<T, P extends Key<T>, C> = T[P] extends C ? never : P;

export type InverseFilter<T, C> = { [P in Key<T>]: InverseFilterCondition<T, P, C> }[Key<T>];

export type FilterWhereNot<T, C> = Pick<T, InverseFilter<T, C>>;

export type Delegate<TArgs extends Array<unknown>, R> = (...args: TArgs) => R;

export type Action<TArgs extends Array<unknown> = Array<void>> = Delegate<TArgs, void>;
