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
import { Validation as V } from "farmify"

// some primitive validation rules
const positive = (n: number): V.Validation<string> =>
  n > 0 ? V.success() : V.failure(["not positive"])

const required = <T>(t: T): V.Validation<string> =>
  t ? V.success() : V.failure(["value required"])

// non primitive type
type Person = {
  name: string;
  age: number
}

import { PredValidation as PV } from "farmify"

// make a primitive validation work for a non primitive type
const positiveAge = PV.contramap((x: Person) => x.age, positive);

// combine 0 - many validations into a single validation where
// all rules must pass to be valid and all failures are aggregated
const validatePerson = PV.combine(
  positiveAge,
  PV.contramap((x: Person) => x.name, required)
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
import { Validation as V } from "farmify"

type FormError = {
  val: any;
  prop: string;
  error: string;
};

const maxLength = (maxLength: number, prop: string) => (
  n: number
): V.Validation<FormError> =>
  n <= maxLength
    ? V.success()
    : V.failure([
        {
          val: n,
          prop: prop,
          error: "value too long"
        }
      ]);
```

### Working with asynchronous validation

```typescript
import { Validation as V, AsyncValidation as A } from "farmify"

// an asynchronous validation
const isUnique = async (username: string): Promise<V.Validation<string>> => {
  const matchedUser = await getUser(username);
  return matchedUser 
    ? failure([ "Username already taken" ]) 
    : success()
}

// a non asynchronous validation
const maxLength = (maxLength: number) => (s: string): V.Validation<string>> => 
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
