import { MockProvider } from '@ethereum-waffle/provider';
import { Interface } from '@ethersproject/abi';
import chai, { expect } from 'chai';
import { deployContract, solidity } from 'ethereum-waffle';
import chaiAsPromised from 'chai-as-promised';
import { ERC20Mock, MultiCall2, multicall2 } from '../src';
import { BigNumber } from '@ethersproject/bignumber';
import { sendEmptyTx } from './utils/sendEmptyTx';
import { utils } from 'ethers';
chai.use(solidity);
chai.use(chaiAsPromised);
describe('Multicall2', () => {
    const mockProvider = new MockProvider();
    const [deployer] = mockProvider.getWallets();
    let tokenContract;
    let multicallContract;
    beforeEach(async () => {
        const args = ['MOCKToken', 'MOCK', deployer.address, '10000'];
        tokenContract = await deployContract(deployer, ERC20Mock, args);
        multicallContract = await deployContract(deployer, MultiCall2);
    });
    it('Retrieves token balance using tryAggregate', async () => {
        const data = new Interface(ERC20Mock.abi).encodeFunctionData('balanceOf', [deployer.address]);
        const call = {
            address: tokenContract.address,
            data,
        };
        const blockNumber = await mockProvider.getBlockNumber();
        const result = await multicall2(mockProvider, multicallContract.address, blockNumber, [call]);
        const { value, success } = result[tokenContract.address][data] || {};
        expect(success).to.be.true;
        expect(BigNumber.from(value)).to.eq('10000');
    });
    it('Fails to retrieve data on block number in the future', async () => {
        const data = new Interface(ERC20Mock.abi).encodeFunctionData('balanceOf', [deployer.address]);
        const call = {
            address: tokenContract.address,
            data,
        };
        const blockNumber = (await mockProvider.getBlockNumber()) + 1;
        await expect(multicall2(mockProvider, multicallContract.address, blockNumber, [call])).to.be.eventually.rejected;
    });
    it('Does not fail when retrieving data on block number from the past', async () => {
        const data = new Interface(ERC20Mock.abi).encodeFunctionData('balanceOf', [deployer.address]);
        const call = {
            address: tokenContract.address,
            data,
        };
        await sendEmptyTx(deployer);
        const blockNumber = (await mockProvider.getBlockNumber()) - 1;
        const result = await multicall2(mockProvider, multicallContract.address, blockNumber, [call]);
        const { value, success } = result[tokenContract.address][data] || {};
        expect(success).to.be.true;
        expect(BigNumber.from(value)).to.eq('10000');
    });
    it('Does not fail when doing multiple calls at once', async () => {
        const erc20Interface = new Interface(ERC20Mock.abi);
        const calls = [
            {
                address: tokenContract.address,
                data: erc20Interface.encodeFunctionData('balanceOf', [deployer.address]),
            },
            {
                address: tokenContract.address,
                data: erc20Interface.encodeFunctionData('symbol', []),
            },
            {
                address: tokenContract.address,
                data: erc20Interface.encodeFunctionData('balanceOf', [tokenContract.address]),
            },
        ];
        const blockNumber = await mockProvider.getBlockNumber();
        const result = await multicall2(mockProvider, multicallContract.address, blockNumber, calls);
        let { value, success } = result[calls[0].address][calls[0].data] || {};
        expect(value).to.equal(BigNumber.from(10000));
        expect(success).to.be.true;
        ({ value, success } = result[calls[1].address][calls[1].data] || {});
        const decodedSymbol = utils.defaultAbiCoder.decode(['string'], value)[0];
        expect(decodedSymbol).to.equal('MOCK');
        expect(success).to.be.true;
        ({ value, success } = result[calls[2].address][calls[2].data] || {});
        expect(value).to.equal(BigNumber.from(0));
        expect(success).to.be.true;
    });
    it('Does not fail when some of the calls fail', async () => {
        const erc20Interface = new Interface(ERC20Mock.abi);
        const calls = [
            {
                address: tokenContract.address,
                data: erc20Interface.encodeFunctionData('balanceOf', [deployer.address]),
            },
            // invalid one
            {
                address: tokenContract.address,
                data: erc20Interface.encodeFunctionData('transferFrom', [
                    multicallContract.address,
                    deployer.address,
                    BigNumber.from(10000),
                ]),
            },
            {
                address: tokenContract.address,
                data: erc20Interface.encodeFunctionData('balanceOf', [tokenContract.address]),
            },
        ];
        const blockNumber = await mockProvider.getBlockNumber();
        const result = await multicall2(mockProvider, multicallContract.address, blockNumber, calls);
        let { value, success } = result[calls[0].address][calls[0].data] || {};
        expect(value).to.equal(BigNumber.from(10000));
        expect(success).to.be.true;
        ({ value, success } = result[calls[1].address][calls[1].data] || {});
        const decodedValue = new utils.Interface(['function Error(string)']).decodeFunctionData('Error', value)[0];
        expect(decodedValue).to.equal('ERC20: transfer amount exceeds balance');
        expect(success).to.be.false;
        ({ value, success } = result[calls[2].address][calls[2].data] || {});
        expect(value).to.equal(BigNumber.from(0));
        expect(success).to.be.true;
    });
});
//# sourceMappingURL=multicall2.test.js.map