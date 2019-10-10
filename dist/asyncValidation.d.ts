import { Validation } from "./validation";
import { PredValidation } from "./predValidation";
export declare type AsyncPredValidation<A, E> = (a: A) => Promise<Validation<E>>;
export declare const lift: <A, E>(v: PredValidation<A, E>) => AsyncPredValidation<A, E>;
export declare const asyncPredValidationMonoid: <A>() => {
    empty: () => Promise<Validation<A>>;
    append: (x: any, y: any) => (a: A) => Promise<Validation<A>>;
};
export declare const combine: <A, E>(...as: AsyncPredValidation<A, E>[]) => AsyncPredValidation<A, E>;
