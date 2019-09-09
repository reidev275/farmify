import * as V from "../src/validation";
import * as PV from "../src/predValidation";
import { expect } from "chai";
import "mocha";
import * as fc from "fast-check";
import { Person, isPositive, lessThan, firstIsDefined } from "./helpers";
import { assert } from "chai";

const validate: PV.PredValidation<Person, string> = PV.combine(
  PV.contramap((p: Person) => p.age, isPositive),
  firstIsDefined
);

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

const ageValidation = PV.contramap(
  (p: Person) => p.age,
  PV.combine(isPositive, lessThan(100))
);

describe("Contramap to combine", () => {
  it("works", () => {
    fc.assert(
      fc.property(
        fc.integer(1, 99),
        age => ageValidation({ first: "", age: age }).kind == "Success"
      )
    );
  });
});

const positive = (property: string) => (
  n: number
): V.Validation<{ property: string; error: string }> =>
  n > 0
    ? V.success()
    : V.failure([{ property: property, error: "age was negative" }]);

type Foo = { foo: number };
const values = [{ foo: 1 }, { foo: 2 }, { foo: -1 }];

describe("all", () => {
  it("allows indexing the error type", () => {
    const validate = PV.all(
      PV.contramap((x: Foo) => x.foo, positive("foo")),
      (e, i) => ({ ...e, index: i })
    );
    assert.equal(V.cata(validate(values), () => [], es => es)[0].index, 2);
  });
});
