// a type to contain information about validation results
export type Validation<E> =
  | { kind: "Success" }
  | { kind: "Failure"; errors: E[] };

// helper functions to create Validation objects
export const success = <E>(): Validation<E> => ({ kind: "Success" });
export const failure = <E>(errors: E[]): Validation<E> => ({
  kind: "Failure",
  errors: errors
});

export const validationMonoid = {
  empty: success,
  append: (x, y) => {
    if (x.kind === "Success" && y.kind === "Success") return x;

    let errors = [];
    if (x.kind === "Failure") {
      errors = [...errors, ...x.errors];
    }
    if (y.kind === "Failure") {
      errors = [...errors, ...y.errors];
    }
    return failure(errors);
  }
};

export const combine = <E>(...as: Validation<E>[]): Validation<E> => {
  const M = validationMonoid;
  return as.reduce(M.append, M.empty);
};
