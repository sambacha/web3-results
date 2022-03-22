import type { Provider } from '../types';

export interface EthersProviderLike {
  send<Result>(method: string, params: unknown[] | unknown): Promise<Result>;
}

/**
 * Ethers.js provider, which can be used with an instance of the Ethers.js Provider class.
 */
const provider: Provider<EthersProviderLike> = {
  isProvider: (provider: unknown): provider is EthersProviderLike => {
    return (provider as EthersProviderLike)?.send !== undefined;
  },

  send<Result>(provider: EthersProviderLike, method: string, params: unknown[]): Promise<Result> {
    return provider.send(method, params);
  }
};

export default provider;
