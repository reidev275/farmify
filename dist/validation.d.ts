export declare type Validation<E> = {
    kind: "Success";
} | {
    kind: "Failure";
    errors: E[];
};
export declare const success: <E>() => Validation<E>;
export declare const failure: <E>(errors: E[]) => Validation<E>;
export declare const cata: <E, A>(v: Validation<E>, onSuccess: () => A, onFailure: (errors: E[]) => A) => A;
export declare const map: <E, F>(f: (e: E) => F, v: Validation<E>) => Validation<F>;
export interface Monoid<A> {
    empty: A;
    append(x: A, y: A): A;
}
export declare const validationMonoid: <E>() => Monoid<Validation<E>>;
export declare const combine: <E>(...as: Validation<E>[]) => Validation<E>;
