import type { AuthCodeMethod, AuthCodeScopeMap, BridgeAuthCodeResponse } from '../types/toka'

const IS_LOCALHOST = window.location.hostname === 'localhost'

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
  if (IS_LOCALHOST) {
    console.log(`[TokaAuth] Localhost — mock authCode para ${method}`)
    return `mock_${method}_dev`
  }

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
          reject(new Error(`[${res.resultCode}] ${res.resultMsg ?? 'Error desconocido'}`))
        }
      }
    )
  })
}