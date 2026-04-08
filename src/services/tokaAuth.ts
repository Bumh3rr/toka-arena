// ── Tipos ──────────────────────────────────────────────────────────────────
export interface TokaAuthResult {
  authCode: string
}

export interface TokaUserInfo {
  nickName:    string
  avatar:      string
  userId:      string
}

// ── Detectar entorno ────────────────────────────────────────────────────────
const isInTokaWebView = (): boolean => {
  return typeof window !== 'undefined' &&
    !!(window as any).AlipayJSBridge
}

// ── Helper para llamar JSAPIs ───────────────────────────────────────────────
function callJSAPI<T>(method: string, params: object): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!isInTokaWebView()) {
      reject(new Error(`AlipayJSBridge no disponible — método: ${method}`))
      return
    }
    ;(window as any).AlipayJSBridge.call(method, params, (result: any) => {
      if (result?.error) {
        reject(new Error(`JSAPI ${method} falló: ${result.error}`))
      } else {
        resolve(result as T)
      }
    })
  })
}

// ── SDK de Toka Auth ────────────────────────────────────────────────────────
export const tokaAuth = {

  /**
   * Obtiene el authCode de Digital Identity (avatar + nickname + userId)
   * Muestra popup de autorización al usuario en la Super App
   */
  async getDigitalIdentityAuthCode(): Promise<string> {
    if (!isInTokaWebView()) {
      // Mock para desarrollo local
      console.warn('[tokaAuth] Fuera del WebView — usando authCode mock')
      return 'MOCK_DEV_001'
    }

    const result = await callJSAPI<{ authCode: string }>(
      'getUserDigitalIdentityAuthCode',
      {
        usage: 'Toka Arena necesita tu perfil para iniciar sesión',
        scopes: ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'],
      }
    )

    return result.authCode
  },

  /**
   * Verifica si estamos corriendo dentro del WebView de Toka
   */
  isAvailable(): boolean {
    return isInTokaWebView()
  },

  /**
   * Espera a que AlipayJSBridge esté listo (puede tardar unos ms al cargar)
   */
  waitForBridge(): Promise<void> {
    return new Promise((resolve) => {
      if (isInTokaWebView()) {
        resolve()
        return
      }

      // AlipayJSBridge dispara este evento cuando está listo
      document.addEventListener('AlipayJSBridgeReady', () => resolve(), { once: true })

      // Timeout de seguridad — si no llega en 3s, resolvemos igual (será mock)
      setTimeout(resolve, 3000)
    })
  }
}
