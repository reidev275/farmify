import { Validation } from "./validation";
export declare type PredValidation<A, E> = (a: A) => Validation<E>;
export declare const contramap: <A, B, C>(f: (b: B) => A, v: (a: A) => C) => (b: B) => C;
export declare const combine: <A, E>(...as: PredValidation<A, E>[]) => PredValidation<A, E>;
export declare const all: <A, E>(validate: PredValidation<A, E>, f: (e: E, i: number) => E) => PredValidation<A[], E>;
