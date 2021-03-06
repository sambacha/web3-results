export interface Provider<T> {
  isProvider(provider: unknown): provider is T;
  send<Result>(provider: T, method: string, params: unknown[]): Promise<Result>;
}

export type InferProviderType<P extends readonly unknown[]> = {
  [K in keyof P]: P[K] extends P[number] ? (P[K] extends Provider<infer T> ? T : never) : never;
};

export type TupleToUnion<P extends readonly unknown[]> = P[number];
export type ProviderType<P extends readonly unknown[]> = TupleToUnion<InferProviderType<P>>;
