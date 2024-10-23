export interface FetchOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?:
    | string
    | FormData
    | URLSearchParams
    | Blob
    | ArrayBuffer
    | DataView
    | Int8Array
    | Uint8Array
    | Uint8ClampedArray
    | Int16Array
    | Uint16Array
    | Int32Array
    | Uint32Array
    | Float32Array
    | Float64Array
    | ReadableStream<Uint8Array>
    | null;
  credentials?: "omit" | "same-origin" | "include";
  mode?: "cors" | "no-cors" | "same-origin";
  cache?:
    | "default"
    | "no-store"
    | "reload"
    | "no-cache"
    | "force-cache"
    | "only-if-cached";
  redirect?: "follow" | "manual" | "error";
  referrer?: string;
  referrerPolicy?:
    | "no-referrer"
    | "no-referrer-when-downgrade"
    | "origin"
    | "origin-when-cross-origin"
    | "same-origin"
    | "strict-origin"
    | "strict-origin-when-cross-origin"
    | "unsafe-url";
  integrity?: string;
  keepalive?: boolean;
  signal?: AbortSignal | null;
  window?: any; // Can be `null` or `undefined`
}
