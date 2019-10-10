"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// helper functions to create Validation objects
exports.success = () => ({ kind: "Success" });
exports.failure = (errors) => ({
    kind: "Failure",
    errors: errors
});
exports.cata = (v, onSuccess, onFailure) => {
    switch (v.kind) {
        case "Success":
            return onSuccess();
        case "Failure":
            return onFailure(v.errors);
    }
};
exports.map = (f, v) => exports.cata(v, () => exports.success(), errors => exports.failure(errors.map(f)));
exports.validationMonoid = () => ({
    empty: exports.success(),
    append: (x, y) => {
        if (x.kind === "Success" && y.kind === "Success")
            return x;
        let errors = [];
        if (x.kind === "Failure") {
            errors = [...errors, ...x.errors];
        }
        if (y.kind === "Failure") {
            errors = [...errors, ...y.errors];
        }
        return exports.failure(errors);
    }
});
exports.combine = (...as) => {
    const M = exports.validationMonoid();
    return as.reduce(M.append, M.empty);
};
//# sourceMappingURL=validation.js.map