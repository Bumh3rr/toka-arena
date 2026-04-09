import { useState, useEffect } from 'react';

function getAuthCode(
  method: string,
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

export default function GetAuthCode() {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = () => {
      getAuthCode('KYCStatus', ['USER_KYC_STATUS'])
        .then((code) => setAuthCode(code))
        .catch((err) => setError(String(err)));
    };

    if (window.AlipayJSBridge) {
      run(); // ya está listo
    } else {
      document.addEventListener('AlipayJSBridgeReady', run, false);
      return () => document.removeEventListener('AlipayJSBridgeReady', run, false);
    }
  }, []);

  return (
    <div>
      <h1>Login</h1>
      {authCode && <p>AuthCode obtenido: {authCode}</p>}
      {error && <p>Error: {error}</p>}
      {!authCode && !error && <p>Obteniendo código de autenticación...</p>}
    </div>
  );
}