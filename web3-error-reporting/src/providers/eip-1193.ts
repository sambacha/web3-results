import type { JsonRpcPayload, Provider } from '../types';
import { getPayload } from './http';

export interface EIP1193ProviderLike {
  request<Result>(transaction: JsonRpcPayload): Promise<Result>;
}

/**
 * EIP-1193 provider, which can be used with the `window.ethereum` object.
 */
const provider: Provider<EIP1193ProviderLike> = {
  isProvider: (provider: unknown): provider is EIP1193ProviderLike => {
    return (provider as EIP1193ProviderLike)?.request !== undefined;
  },

  send: async <Result>(provider: EIP1193ProviderLike, method: string, params: unknown[]): Promise<Result> => {
    const payload = getPayload(method, params);
    return provider.request(payload);
  }
};

export default provider;
