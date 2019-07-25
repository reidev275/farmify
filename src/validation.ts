// a type to contain information about validation results
export type Validation =
  | { kind: "Success" }
  | { kind: "Failure"; errors: string[] };

// helper functions to create Validation objects
export const success: Validation = { kind: "Success" };
export const failure = (errors: string[]): Validation => ({
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
