export function getAuthCodeFromURL(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('authCode');
}

function getAuthCode(
  method: 'DigitalIdentity' | 'ContactInformation' | 'AddressInformation' | 'PersonalInformation' | 'KYCStatus',
  scopes: string[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    window.AlipayJSBridge.call(`getUser${method}AuthCode`, {
      usage: 'Toka Arena necesita verificar tu identidad',
      scopes,
      success: (res: Record<string, unknown>) => resolve(res.result as string),
      fail: (err: unknown) => reject(err),
    });
  });
}

export const tokaAuth = {
  getDigitalIdentityAuthCode: () =>
    getAuthCode('DigitalIdentity', ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME']),

  getKYCStatusAuthCode: () =>
    getAuthCode('KYCStatus', ['USER_KYC_STATUS']),
};

export function isInsideToka(): boolean {
  return !!window.AlipayJSBridge;
}