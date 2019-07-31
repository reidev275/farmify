import * as V from "../src/validation";
import * as PV from "../src/predValidation";
import * as AV from "../src/asyncValidation";
import { expect } from "chai";
import "mocha";
import * as fc from "fast-check";
import { Person, isPositive, firstIsDefined } from "./helpers";

const positive = (n: number) => Promise.resolve(isPositive(n));

const validate = AV.combine(
  PV.contramap((p: Person) => p.age, positive),
  AV.lift(firstIsDefined)
);

describe("Async Validation Combination", () => {
  it("is Successful when it should be", () => {
    fc.assert(
      fc.asyncProperty(fc.string(1, 10), fc.integer(1, 99999), (first, age) =>
        validate({ first, age }).then(k => k.kind == "Success")
      )
    );
  });

  it("is Failure when it should be", () => {
    fc.assert(
      fc.asyncProperty(fc.integer(0), age =>
        validate({ first: "", age: age }).then(
          k => V.cata(k, () => 0, e => e.length) == 2
        )
      )
    );
  });
});
