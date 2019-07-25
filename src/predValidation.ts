import { Validation, validationMonoid, success, failure } from "./validation";

export type PredValidation<A> = (a: A) => Validation;

// proof we can combine 0-many PredValidation<A> types in such
// a way that all validations must pass
const predValidationMonoid = <A>() => ({
  empty: () => validationMonoid.empty,
  append: (x, y) => (a: A) => validationMonoid.append(x(a), y(a))
});

// a way to make primitive validation rules work for a non primitive type
export const contramap = <A, B, C>(
  f: (b: B) => A,
  v: (a: A) => C
): ((b: B) => C) => (b: B) => v(f(b));

// a way to combining multiple validation rules into a single validation rule
export const combine = <A>(...as: PredValidation<A>[]): PredValidation<A> => {
  const M = predValidationMonoid<A>();
  return as.reduce(M.append, M.empty);
};
