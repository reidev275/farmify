import { Validation, validationMonoid, success, failure } from "./validation";
import { PredValidation, contramap } from "./predValidation";

export type AsyncPredValidation<A, E> = (a: A) => Promise<Validation<E>>;

// A way to turn a PredValidation into an AsyncPredValidation
export const lift = <A, E>(
  v: PredValidation<A, E>
): AsyncPredValidation<A, E> => (a: A) => Promise.resolve(v(a));

export const asyncPredValidationMonoid = <A>() => ({
  empty: () => Promise.resolve(validationMonoid.empty),
  append: (x, y) => (a: A) =>
    Promise.all([x(a), y(a)]).then(([v1, v2]) =>
      validationMonoid.append(v1, v2)
    )
});

export const combine = <A, E>(
  ...as: AsyncPredValidation<A, E>[]
): AsyncPredValidation<A, E> => {
  const M = asyncPredValidationMonoid<A>();
  return as.reduce(M.append, M.empty);
};
