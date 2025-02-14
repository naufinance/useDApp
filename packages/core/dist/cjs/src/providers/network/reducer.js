"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.networksReducer = exports.defaultNetworkState = void 0;
exports.defaultNetworkState = {
    provider: undefined,
    chainId: undefined,
    accounts: [],
    errors: []
};
function networksReducer(prevState, actions) {
    switch (actions.type) {
        case 'UPDATE_NETWORK':
            return __assign(__assign({}, prevState), actions.network);
        case 'ADD_ERROR':
            return __assign(__assign({}, prevState), { errors: __spreadArrays(prevState.errors, [actions.error]) });
        default:
            return prevState;
    }
}
exports.networksReducer = networksReducer;
//# sourceMappingURL=reducer.js.map