"use strict";
exports.__esModule = true;
exports.NetworkActivator = void 0;
var react_1 = require("react");
var hooks_1 = require("../hooks");
var config_1 = require("./config");
var providers_1 = require("@ethersproject/providers");
var injectedNetwork_1 = require("./injectedNetwork");
function NetworkActivator(_a) {
    var providerOverride = _a.providerOverride;
    var _b = hooks_1.useEthers(), activate = _b.activate, activateBrowserWallet = _b.activateBrowserWallet, connectedChainId = _b.chainId;
    var _c = config_1.useConfig(), readOnlyChainId = _c.readOnlyChainId, readOnlyUrls = _c.readOnlyUrls, autoConnect = _c.autoConnect, pollingInterval = _c.pollingInterval;
    var injectedProvider = injectedNetwork_1.useInjectedNetwork();
    var _d = react_1.useState(false), readonlyConnected = _d[0], setReadonlyConnected = _d[1];
    react_1.useEffect(function () {
        if (providerOverride) {
            activate(providerOverride);
        }
    }, [providerOverride]);
    react_1.useEffect(function () {
        if (readOnlyChainId && readOnlyUrls && !providerOverride) {
            if (readOnlyUrls[readOnlyChainId] && connectedChainId !== readOnlyChainId) {
                var provider = new providers_1.JsonRpcProvider(readOnlyUrls[readOnlyChainId]);
                provider.pollingInterval = pollingInterval;
                activate(provider).then(function () { return setReadonlyConnected(true); });
            }
        }
    }, [readOnlyChainId, readOnlyUrls]);
    react_1.useEffect(function () {
        autoConnect && injectedProvider && !providerOverride && readonlyConnected && activateBrowserWallet();
    }, [readonlyConnected]);
    return null;
}
exports.NetworkActivator = NetworkActivator;
//# sourceMappingURL=NetworkActivator.js.map