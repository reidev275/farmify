import * as V from "../src/validation";
import { expect } from "chai";
import "mocha";

type Person = { first: string; age: number };

const ageIsPositive = (p: Person): V.Validation<string> =>
  p.age > 0 ? V.success() : V.failure(["age was negative"]);

const firstIsDefined = (p: Person): V.Validation<string> =>
  p.first ? V.success() : V.failure(["first not defined"]);

const validate = (p: Person) => V.combine(ageIsPositive(p), firstIsDefined(p));

const successfulPerson = { first: "Reid", age: 1 };
const failurePerson = { first: undefined, age: -1 };

describe("Validation Combination", () => {
  it("is Successful when it should be", () => {
    const result = validate(successfulPerson);
    expect(result.kind).to.equal("Success");
  });

  it("is Failure when it should be", () => {
    const result = validate(failurePerson);
    expect(result.kind).to.equal("Failure");

    const failures = V.cata(result, () => 0, e => e.length);
    expect(failures).to.equal(2);
  });
});
