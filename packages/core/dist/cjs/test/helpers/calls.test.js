"use strict";
exports.__esModule = true;
var chai_1 = require("chai");
var ethers_1 = require("ethers");
var utils_1 = require("ethers/lib/utils");
var src_1 = require("../../src");
describe('decodeCallResult', function () {
    var erc20Abi = ['function name() view returns (string)'];
    var call = {
        contract: new ethers_1.Contract("0x" + '0'.repeat(39) + "1", new utils_1.Interface(erc20Abi)),
        method: 'name',
        args: []
    };
    it('one of arguments undefined', function () {
        var result = { value: '', success: true };
        chai_1.expect(src_1.decodeCallResult(undefined, result)).to.be.undefined;
        chai_1.expect(src_1.decodeCallResult(call, undefined)).to.be.undefined;
    });
    it('error', function () {
        var errorMessage = 'Testing error message';
        var errorResult = {
            success: false,
            value: new ethers_1.utils.Interface(['function Error(string)']).encodeFunctionData('Error', [errorMessage])
        };
        chai_1.expect(src_1.decodeCallResult(call, errorResult)).to.deep.equal({ value: undefined, error: new src_1.CallError(errorMessage) });
    });
    it('success', function () {
        var name = 'Testing ERC20';
        var successResult = {
            success: true,
            value: call.contract.interface.encodeFunctionResult('name', [name])
        };
        chai_1.expect(src_1.decodeCallResult(call, successResult)).to.deep.equal({ value: [name], error: undefined });
    });
});
//# sourceMappingURL=calls.test.js.map