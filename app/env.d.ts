declare module 'cloudflare:workers' {
  export const env: Env;
}

interface D1Database {
  prepare(sql: string): unknown;
  batch<T = unknown>(statements: unknown[]): Promise<T[]>;
  exec(sql: string): Promise<unknown>;
  dump(): Promise<ArrayBuffer>;
}

interface R2Bucket {
  put(
    key: string,
    value: ReadableStream | ArrayBuffer | string | Blob | null,
    options?: unknown
  ): Promise<unknown>;
  get(key: string): Promise<{ arrayBuffer(): Promise<ArrayBuffer> } | null>;
  delete(key: string): Promise<void>;
}

interface Env {
  D1_DB: D1Database;
  R2_BUCKET: R2Bucket;
  BETTER_AUTH_SECRET: string;
  BETTER_AUTH_URL: string;
  R2_PUBLIC_URL: string;
  [key: string]: unknown;
}
