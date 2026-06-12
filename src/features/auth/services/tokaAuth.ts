import type { AuthCodeMethod, AuthCodeScopeMap, BridgeAuthCodeResponse } from '@/features/auth/types/toka'
const IS_DEV = import.meta.env.DEV

function waitForBridge(): Promise<void> {
  return new Promise((resolve) => {
    if (window.AlipayJSBridge) {
      resolve()
    } else {
      document.addEventListener('AlipayJSBridgeReady', () => resolve(), { once: true })
    }
  })
}

export async function getAuthCode<M extends AuthCodeMethod>(
  method: M,
  scopes: AuthCodeScopeMap[M][]
): Promise<string> {
  if (IS_DEV) {
    console.log(`Simulando obtención de authCode`)
    return 'DEBUG'
  }

  console.log(`[INFO] Solicitando authCode`)
  await waitForBridge()

  return new Promise((resolve, reject) => {
    window.AlipayJSBridge.call(
      `getUser${method}AuthCode`,
      {
        usage: 'Autenticación en Toka Arena',
        scopes,
      },
      (res: Partial<BridgeAuthCodeResponse>) => {
        if (res.resultCode === 10000 && res.result) {
          resolve(res.result)
        } else {
          reject(new Error(`[${res.resultCode}] ${res.resultMsg ?? 'Error desconocido al autenticarse con Toka'}`))
        }
      }
    )
  })
}
