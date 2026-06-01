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

export async function getAuthCode(): Promise<string> {
  if (IS_LOCALHOST) {
    return 'mock_auth_code_dev'
  }

  await waitForBridge()

  return new Promise((resolve, reject) => {
    window.AlipayJSBridge.call(
      'getUserDigitalIdentityAuthCode',
      {
        usage: 'Autenticación en Toka Arena',
        scopes: ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'],
      },
      (res: Record<string, unknown>) => {
        console.log('[Bridge raw response]', JSON.stringify(res)) // ← ver estructura real
        const result = res?.result as { authCode?: string } | undefined
        if (result?.authCode) {
          resolve(result.authCode)
        } else {
          reject(JSON.stringify(res)) // ← mostrar respuesta completa en lugar del mensaje genérico
        }
      }
    )
  })
}