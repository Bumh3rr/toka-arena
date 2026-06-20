import type { BridgeAuthCodeResponse } from '../../features/auth/model/toka'

export {}

interface AlipayJSBridge {
  call(
    method: string,
    params: Record<string, unknown>,
    callback?: (res: Partial<BridgeAuthCodeResponse>) => void
  ): void
}

declare global {
  interface Window {
    AlipayJSBridge: AlipayJSBridge
  }
}