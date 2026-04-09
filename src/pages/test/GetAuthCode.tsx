import { useState, useEffect } from 'react';

export default function GetAuthCode() {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const addLog = (msg: string) => {
    console.info(msg);
    setLog(prev => [...prev, msg]);
  };

  useEffect(() => {
    const run = () => {
      addLog(`window.AlipayJSBridge: ${!!window.AlipayJSBridge}`);

      const methods = [
        { method: 'KYCStatus', scopes: ['USER_KYC_STATUS'] },
        { method: 'DigitalIdentity', scopes: ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'] },
        { method: 'ContactInformation', scopes: ['PLAINTEXT_MOBILE_PHONE'] },
      ];

      methods.forEach(({ method, scopes }) => {
        addLog(`Probando: getUser${method}AuthCode`);
        window.AlipayJSBridge.call(`getUser${method}AuthCode`, {
          usage: 'Toka Arena necesita verificar tu identidad',
          scopes,
          success: (res: Record<string, unknown>) => {
            addLog(`✅ ${method} success: ${JSON.stringify(res)}`);
            setAuthCode(res.result as string);
          },
          fail: (err: unknown) => {
            addLog(`❌ ${method} fail: ${JSON.stringify(err)}`);
            setError(`Error al obtener el código de autenticación para ${method}`);
          },
        });
      });
    };

    if (window.AlipayJSBridge) {
      run();
    } else {
      addLog('Esperando AlipayJSBridgeReady...');
      document.addEventListener('AlipayJSBridgeReady', run, false);
      return () => document.removeEventListener('AlipayJSBridgeReady', run, false);
    }
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Login</h1>
      {authCode && <p style={{ color: 'green' }}>✅ AuthCode: {authCode}</p>}
      {error && <p style={{ color: 'red' }}>❌ Error: {error}</p>}
      {!authCode && !error && <p>Obteniendo código de autenticación...</p>}
      <div style={{ marginTop: 16 }}>
        {log.map((l, i) => (
          <p key={i} style={{ fontSize: 12, color: 'gray', margin: 2 }}>{l}</p>
        ))}
      </div>
    </div>
  );
}