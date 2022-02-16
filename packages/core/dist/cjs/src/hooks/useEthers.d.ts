/// <reference types="node" />
import { JsonRpcProvider } from '@ethersproject/providers';
import { EventEmitter } from 'events';
declare type SupportedProviders = JsonRpcProvider | EventEmitter | {
    getProvider: () => JsonRpcProvider | EventEmitter;
    activate: () => Promise<void>;
};
export declare type Web3Ethers = {
    activate: (provider: SupportedProviders) => Promise<void>;
    setError: (error: Error) => void;
    deactivate: () => void;
    connector: undefined;
    chainId?: number;
    account?: null | string;
    error?: Error;
    library?: JsonRpcProvider;
    active: boolean;
    activateBrowserWallet: () => void;
};
export declare function useEthers(): Web3Ethers;
export {};
//# sourceMappingURL=useEthers.d.ts.map