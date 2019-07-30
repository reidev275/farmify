import * as V from "../src/validation";
import { expect } from "chai";
import "mocha";
import * as fc from "fast-check";

type Person = { first: string; age: number };

const ageIsPositive = (p: Person): V.Validation<string> =>
  p.age > 0 ? V.success() : V.failure(["age was negative"]);

const firstIsDefined = (p: Person): V.Validation<string> =>
  p.first ? V.success() : V.failure(["first not defined"]);

const validate = (p: Person) => V.combine(ageIsPositive(p), firstIsDefined(p));

const failurePerson = { first: undefined, age: -1 };

describe("Validation Combination", () => {
  it("is Successful when it should be", () => {
    fc.assert(
      fc.property(
        fc.string(1, 10),
        fc.integer(0, 99999),
        (first, age) => validate({ first, age }).kind == "Success"
      )
    );
  });

  it("is Failure when it should be", () => {
    fc.assert(
      fc.property(
        fc.integer(0),
        age =>
          V.cata(
            validate({ first: undefined, age: age }),
            () => 0,
            e => e.length
          ) == 2
      )
    );
  });
});
