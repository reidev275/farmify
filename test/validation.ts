import { Validation as V } from "../src/index";
import { expect } from "chai";
import "mocha";
import * as fc from "fast-check";
import { Person, isPositive, firstIsDefined } from "./helpers";

const validate = (p: Person) => V.combine(isPositive(p.age), firstIsDefined(p));

describe("Validation Combination", () => {
  it("is Successful when it should be", () => {
    fc.assert(
      fc.property(
        fc.string(1, 10),
        fc.integer(1, 99999),
        (first, age) => validate({ first, age }).kind == "Success"
      )
    );
  });

  it("is Failure when it should be", () => {
    fc.assert(
      fc.property(
        fc.integer(0),
        age =>
          V.cata(validate({ first: "", age: age }), () => 0, e => e.length) == 2
      )
    );
  });
});
