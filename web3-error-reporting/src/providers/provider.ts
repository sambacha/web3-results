import { fromHex, stripPrefix } from '@findeth/abi';
import type { Provider, ProviderType } from '../types';
import EIP1193Provider from './eip-1193';
import EthersProvider from './ethers';
import HttpProvider from './http';
import Web3Provider from './web3';

const providers = [EIP1193Provider, EthersProvider, HttpProvider, Web3Provider] as const;

export type ProviderLike = ProviderType<typeof providers>;

export const getProvider = (providerLike: ProviderLike): Provider<unknown> => {
  const provider = providers.find((type) => type.isProvider(providerLike));
  if (!provider) {
    throw new Error('Invalid provider type');
  }

  return provider;
};

/**
 * Send a call with the data, using the specified provider. If the provider is not a valid provider type (e.g. not a
 * Ethers.js provider, URL or Web3 provider), this will throw an error.
 *
 * @param {ProviderLike} providerLike
 * @param {string} contractAddress
 * @param {string} data
 * @return {Promise<Uint8Array>}
 */
export const call = async (providerLike: ProviderLike, contractAddress: string, data: string): Promise<Uint8Array> => {
  try {
    const result = await send<string>(providerLike, 'eth_call', [{ to: contractAddress, data }, 'latest']);
    if (stripPrefix(result).startsWith('08c379a')) {
      throw new Error('Call reverted');
    }

    return fromHex(result);
  } catch (error) {
    throw new Error(`Failed to get data from contract: ${error.stack ?? error.toString()}`);
  }
};

export const send = async <Result>(providerLike: ProviderLike, method: string, params: unknown[]): Promise<Result> => {
  const provider = getProvider(providerLike);
  return provider.send(providerLike, method, params);
};
