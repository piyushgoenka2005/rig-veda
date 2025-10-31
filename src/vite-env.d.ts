/// <reference types="vite/client" />

// Extend ImportMeta interface to support Vite's glob imports
interface ImportMeta {
  readonly glob: <T = Record<string, () => Promise<any>>>(
    pattern: string,
    options?: {
      eager?: boolean;
      import?: string;
      query?: string | Record<string, string | number | boolean>;
    }
  ) => Record<string, () => Promise<T>>;
}

