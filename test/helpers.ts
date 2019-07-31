import * as V from "../src/validation";

export type Person = { first: string; age: number };

export const isPositive = (n: number): V.Validation<string> =>
  n > 0 ? V.success() : V.failure(["age was negative"]);

export const firstIsDefined = (p: Person): V.Validation<string> =>
  p.first.length > 0 ? V.success() : V.failure(["first not defined"]);
