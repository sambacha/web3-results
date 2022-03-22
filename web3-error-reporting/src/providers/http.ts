import fetch from 'isomorphic-unfetch';
import { nanoid } from 'nanoid';
import type { JsonRpcResult, Provider } from '../types';
import { JsonRpcPayload } from '../types';

interface HttpProviderOptions {
  url: string;
  params?: Partial<Omit<RequestInit, 'body' | 'method' | 'headers'>>;
}

export type HttpProviderLike = string | HttpProviderOptions;

/**
 * A raw HTTP provider, which can be used with an Ethereum node endpoint (JSON-RPC), or an `HttpProviderOptions` object.
 */
const provider: Provider<HttpProviderLike> = {
  isProvider: (provider: unknown): provider is HttpProviderLike => {
    return (
      typeof provider === 'string' ||
      (typeof provider === 'object' && (provider as HttpProviderOptions).url !== undefined)
    );
  },

  send: async <Result>(provider: HttpProviderLike, method: string, params: unknown[]): Promise<Result> => {
    const url = typeof provider === 'string' ? provider : provider.url;
    const options = typeof provider === 'object' ? provider.params : {};
    const payload = getPayload(method, params);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload),
      cache: 'no-cache',
      ...options
    });

    if (!response.ok) {
      throw new Error(`Request failed with HTTP error ${response.status}: ${response.statusText}`);
    }

    const { error, result }: JsonRpcResult<Result> = await response.json();
    if (error) {
      throw new Error(`Request failed: ${error.message}`);
    }

    return result;
  }
};

export default provider;

/**
 * Get the JSON-RPC payload for the `eth_call` function.
 */
export const getPayload = (method: string, params: unknown[]): JsonRpcPayload => ({
  jsonrpc: '2.0',
  method,
  params,
  id: nanoid()
});
