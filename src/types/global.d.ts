// src/types/global.d.ts

interface AlipayJSBridgeCallOptions {
  usage?: string;
  scopes?: string[];
  scopeNicks?: string[];
  success?: (res: Record<string, unknown>) => void;
  fail?: (err: unknown) => void;
}

declare global {
  interface Window {
    AlipayJSBridge: {
      call: (method: string, options: AlipayJSBridgeCallOptions) => void;
    };
  }
}

export {};