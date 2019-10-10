"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./validation");
// proof we can combine 0-many PredValidation<A> types in such
// a way that all validations must pass
const predValidationMonoid = () => ({
    empty: () => validation_1.validationMonoid().empty,
    append: (x, y) => (a) => validation_1.validationMonoid().append(x(a), y(a))
});
// a way to make primitive validation rules work for a non primitive type
exports.contramap = (f, v) => (b) => v(f(b));
// a way to combining multiple validation rules into a single validation rule
exports.combine = (...as) => {
    const M = predValidationMonoid();
    return as.reduce(M.append, M.empty);
};
// a way to make a validation work for an array of objects
exports.all = (validate, f) => (as) => {
    const vs = as.map((a, i) => {
        const validation = validate(a);
        return validation_1.map(v => f(v, i), validation);
    });
    return validation_1.combine(...vs);
};
//# sourceMappingURL=predValidation.js.map