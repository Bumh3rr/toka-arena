interface AlipayJSBridgeCallOptions {
  usage?: string;
  scopes?: string[];
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