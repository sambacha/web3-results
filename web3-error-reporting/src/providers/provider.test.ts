import { CONTRACT_ADDRESS } from '../constants';
import EIP1193Provider from './eip-1193';
import EthersProvider from './ethers';
import HttpProvider from './http';
import { send, call } from './provider';
import Web3Provider from './web3';

jest.mock('./eip-1193', () => ({
  isProvider: jest.fn(),
  send: jest.fn().mockImplementation(async () => '0x00')
}));

jest.mock('./ethers', () => ({
  isProvider: jest.fn(),
  send: jest.fn().mockImplementation(async () => '0x00')
}));

jest.mock('./http', () => ({
  isProvider: jest.fn(),
  send: jest.fn().mockImplementation(async () => '0x00')
}));

jest.mock('./web3', () => ({
  isProvider: jest.fn(),
  send: jest.fn().mockImplementation(async () => '0x00')
}));

describe('send', () => {
  it('calls the correct provider', async () => {
    (EIP1193Provider.isProvider as jest.MockedFunction<typeof EIP1193Provider.isProvider>).mockImplementationOnce(
      () => true
    );
    await send('foo', 'eth_call', [{ to: CONTRACT_ADDRESS, data: '0x' }]);

    (EthersProvider.isProvider as jest.MockedFunction<typeof EthersProvider.isProvider>).mockImplementationOnce(
      () => true
    );
    await send('foo', 'eth_call', [{ to: CONTRACT_ADDRESS, data: '0x' }]);

    (HttpProvider.isProvider as jest.MockedFunction<typeof HttpProvider.isProvider>).mockImplementationOnce(() => true);
    await send('foo', 'eth_call', [{ to: CONTRACT_ADDRESS, data: '0x' }]);

    (Web3Provider.isProvider as jest.MockedFunction<typeof Web3Provider.isProvider>).mockImplementationOnce(() => true);
    await send('foo', 'eth_call', [{ to: CONTRACT_ADDRESS, data: '0x' }]);

    expect(EIP1193Provider.send).toHaveBeenCalledTimes(1);
    expect(EthersProvider.send).toHaveBeenCalledTimes(1);
    expect(HttpProvider.send).toHaveBeenCalledTimes(1);
    expect(Web3Provider.send).toHaveBeenCalledTimes(1);
  });

  it('throws for invalid providers', async () => {
    // @ts-expect-error Invalid provider type
    await expect(() => send({}, CONTRACT_ADDRESS, '0x')).rejects.toThrow('Invalid provider type');
  });
});

describe('call', () => {
  it('throws if a call reverts', async () => {
    (EthersProvider.isProvider as jest.MockedFunction<typeof EthersProvider.isProvider>).mockImplementationOnce(
      () => true
    );
    (EthersProvider.send as jest.MockedFunction<typeof EthersProvider.send>).mockImplementationOnce(
      async () => '08c379a'
    );

    await expect(call('foo', CONTRACT_ADDRESS, '0x')).rejects.toThrow();
  });
});
