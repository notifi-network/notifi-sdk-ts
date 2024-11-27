/// <reference types="vite/client" />

interface Window {
  Buffer: typeof Buffer;
}

declare module 'buffer' {
  export const Buffer: typeof global.Buffer;
}

declare global {
  interface Global {
    Buffer: typeof Buffer;
  }
}
