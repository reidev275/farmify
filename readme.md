# Farmify

Validation via Monoidal, Contravariant functors

### Getting Started

```
npm i --save farmify
```

Once you've installed farmify you can then import the modules you need to do your validation.  
Farmify has no constraints on your failure type, so you can easily use simple string values
as shown in this example, or provide your own error type.

```typescript
import { Validation, success, failure } from "farmify/dist/validation"

// some primitive validation rules
const positive = (n: number): Validation<string> =>
  n > 0 ? success() : failure(["not positive"])

const required = <T>(t: T): Validation<string> =>
  t ? success() : failure(["value required"])

// non primitive type
type Person = {
  name: string;
  age: number
}

import { contramap, combine } from "farmify/dist/predValidation"

// make a primitive validation work for a non primitive type
const positiveAge = contramap((x: Person) => x.age, positive);

// combine 0 - many validations into a single validation where
// all rules must pass to be valid and all failures are aggregated
const validatePerson = combine(
  positiveAge,
  contramap((x: Person) => x.name, required)
)

validatePerson({
  name: "Reid",
  age: 37
})
// { kind: "Success" }


validatePerson({
  name: undefined,
  age: -2
})
// { kind: "Failure", errors: [ "value required", "not positive" ] }
```

### Using a custom error type
Farmify is polymorphic in its error type which means you can use whatever you want.

```typescript
type FormError = {
  val: any;
  prop: string;
  error: string;
};

const maxLength = (maxLength: number, prop: string) => (
  n: number
): Validation<FormError> =>
  n <= maxLength
    ? success()
    : failure([
        {
          val: n,
          prop: prop,
          error: "value too long"
        }
      ]);
```

### Working with asynchronous validation

```typescript
import * as A from "farmify/dist/asyncValidation"

// an asynchronous validation
const isUnique = async (username: string): Promise<Validation<string>> => {
  const matchedUser = await getUser(username);
  return matchedUser 
    ? failure([ "Username already taken" ]) 
    : success()
}

// a non asynchronous validation
const maxLength = (maxLength: number) => (s: string): Validation<string>> => 
  s.length <= maxLength 
    ? success()
    : failure([ `Cannot be longer than ${maxLength}`  ])

const validUserName = A.combine(
  A.lift(maxLength(8)), // lifting maxLength into an asynchronous validation
  isUnique
)

validUserName('bob').then(console.log)
//{ kind: "Success" }

validUserName('thisIsTooLong').then(console.log)
//{ kind: "Failure", errors: [ 'Cannot be longer than 8' ] }
```
