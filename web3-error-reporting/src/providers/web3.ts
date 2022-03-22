import type { JsonRpcPayload, JsonRpcResult, Provider } from '../types';
import { getPayload } from './http';

export interface Web3ProviderLike {
  currentProvider: {
    send<T>(payload: JsonRpcPayload, callback: (error: Error | null, result?: JsonRpcResult<T>) => void): void;
  };
}

/**
 * Web3 provider, which can be used with an instance of the Web3 class.
 */
const provider: Provider<Web3ProviderLike> = {
  isProvider: (provider: unknown): provider is Web3ProviderLike => {
    return (provider as Web3ProviderLike)?.currentProvider?.send !== undefined;
  },

  send: <T>(provider: Web3ProviderLike, method: string, params: unknown[]): Promise<T> => {
    const payload = getPayload(method, params);

    return new Promise((resolve, reject) => {
      provider.currentProvider.send<T>(payload, (error, result) => {
        if (error) {
          return reject(error);
        }

        if (!result) {
          return reject(new Error('No response payload'));
        }

        resolve(result.result);
      });
    });
  }
};

export default provider;
