import {
  Monoid,
  Validation,
  validationMonoid,
  success,
  failure
} from "./validation";

export type PredValidation<A, E> = (a: A) => Validation<E>;

// proof we can combine 0-many PredValidation<A> types in such
// a way that all validations must pass
const predValidationMonoid = <A, E>(): Monoid<PredValidation<A, E>> => ({
  empty: () => validationMonoid<E>().empty,
  append: (x, y) => (a: A) => validationMonoid<E>().append(x(a), y(a))
});

// a way to make primitive validation rules work for a non primitive type
export const contramap = <A, B, C>(
  f: (b: B) => A,
  v: (a: A) => C
): ((b: B) => C) => (b: B) => v(f(b));

// a way to combining multiple validation rules into a single validation rule
export const combine = <A, E>(
  ...as: PredValidation<A, E>[]
): PredValidation<A, E> => {
  const M = predValidationMonoid<A, E>();
  return as.reduce(M.append, M.empty);
};
