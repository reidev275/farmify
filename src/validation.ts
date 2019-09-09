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

export const cata = <E, A>(
  v: Validation<E>,
  onSuccess: () => A,
  onFailure: (errors: E[]) => A
): A => {
  switch (v.kind) {
    case "Success":
      return onSuccess();
    case "Failure":
      return onFailure(v.errors);
  }
};

export const map = <E, F>(f: (e: E) => F, v: Validation<E>): Validation<F> =>
  cata(v, () => success<F>(), errors => failure(errors.map(f)));

export interface Monoid<A> {
  empty: A;
  append(x: A, y: A): A;
}

export const validationMonoid = <E>(): Monoid<Validation<E>> => ({
  empty: success<E>(),
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
});

export const combine = <E>(...as: Validation<E>[]): Validation<E> => {
  const M = validationMonoid<E>();
  return as.reduce(M.append, M.empty);
};
