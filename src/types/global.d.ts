export {}

interface AlipayJSBridge {
  call(
    method: string,
    params: Record<string, unknown>,
    callback?: (res: Record<string, unknown>) => void
  ): void
}

declare global {
  interface Window {
    AlipayJSBridge: AlipayJSBridge
  }
}