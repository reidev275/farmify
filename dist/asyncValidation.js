"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validation_1 = require("./validation");
// A way to turn a PredValidation into an AsyncPredValidation
exports.lift = (v) => (a) => Promise.resolve(v(a));
exports.asyncPredValidationMonoid = () => {
    const M = validation_1.validationMonoid();
    return {
        empty: () => Promise.resolve(M.empty),
        append: (x, y) => (a) => Promise.all([x(a), y(a)]).then(([v1, v2]) => M.append(v1, v2))
    };
};
exports.combine = (...as) => {
    const M = exports.asyncPredValidationMonoid();
    return as.reduce(M.append, M.empty);
};
//# sourceMappingURL=asyncValidation.js.map