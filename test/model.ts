import * as V from "../src/validation";
import * as PV from "../src/predValidation";
import { assert, expect } from "chai";
import "mocha";

interface ErrorType {
  path: string;
  error: string;
}

const notBlank = (property: string, s: string): V.Validation<ErrorType> =>
  (s || "").length > 0
    ? V.success()
    : V.failure([{ path: property, error: `${property} was blank` }]);

const positive = (property: string, n: number): V.Validation<ErrorType> =>
  n > 0
    ? V.success()
    : V.failure([{ path: property, error: `${property} was negative` }]);

type Package = { label: string; qty: number };

type Item = { itemNumber: string; packages: Package[] };

// validate a single package
const packageValidation: PV.PredValidation<Package, ErrorType> = (p: Package) =>
  V.combine(positive("qty", p.qty), notBlank("label", p.label));

const prefixIndex = (property: string) => (
  e: ErrorType,
  i: number
): ErrorType => ({
  ...e,
  path: `${property}[${i}].${e.path}`
});

// lift packageValidation to work on an array of Packages
const packagesValidation: PV.PredValidation<Package[], ErrorType> = PV.all(
  packageValidation,
  prefixIndex("packages")
);

// combine packagesValidation with a notBlank to validate an Item
const itemValidation: PV.PredValidation<Item, ErrorType> = PV.combine(
  (i: Item) => notBlank("itemNumber", i.itemNumber),
  (i: Item) => packagesValidation(i.packages)
);

// an invalid item
const invalidItem = {
  itemNumber: "",
  packages: [
    { label: "", qty: -2 },
    { label: "", qty: 2 },
    { label: "pack", qty: 10 }
  ]
};

console.log("input\n----------");
console.log(invalidItem);
console.log("result\n----------");
console.log(itemValidation(invalidItem));
console.log("");

// a valid item
const validItem = {
  itemNumber: "123",
  packages: [{ label: "each", qty: 1 }, { label: "pack", qty: 10 }]
};

console.log("input\n----------");
console.log(validItem);
console.log("result\n----------");
console.log(itemValidation(validItem));
console.log("");

const itemsValidation: PV.PredValidation<Item[], ErrorType> = PV.all(
  itemValidation,
  prefixIndex("")
);

const items = [validItem, invalidItem];

console.log("input\n----------");
console.log(items);
console.log("result\n----------");
console.log(itemsValidation(items));



console.log("");
console.log("");
console.log("");
console.log("");

const getVal = <A>(obj: A, prop: keyof A): A[keyof A] => obj[prop];

console.log(getVal(validItem, "itemNumber"));
