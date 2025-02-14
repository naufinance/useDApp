import { Call } from '../hooks/useCall';
import { Falsy } from '../model/types';
import { RawCall, RawCallResult } from '../providers';
export declare function warnOnInvalidCall(call: Call | Falsy): void;
export declare function encodeCallData(call: Call | Falsy): RawCall | Falsy;
export declare function getUniqueCalls(requests: RawCall[]): RawCall[];
export declare class CallError {
    readonly message: string;
    constructor(message: string);
}
export declare type CallResult = {
    value: any[];
    error: undefined;
} | {
    value: undefined;
    error: CallError;
} | undefined;
export declare function decodeCallResult(call: Call | Falsy, result: RawCallResult): CallResult;
//# sourceMappingURL=calls.d.ts.map