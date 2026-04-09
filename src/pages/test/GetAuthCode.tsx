import { useState, useEffect, useRef } from 'react';

export default function GetAuthCode() {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const gotCode = useRef(false);

  const addLog = (msg: string) => {
    console.info(msg);
    setLog(prev => [...prev, msg]);
  };

  useEffect(() => {
    const run = () => {
      addLog(`Bridge listo`);

      const methods = [
        { method: 'KYCStatus', scopes: ['USER_KYC_STATUS'] },
        { method: 'DigitalIdentity', scopes: ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'] },
        { method: 'ContactInformation', scopes: ['PLAINTEXT_MOBILE_PHONE'] },
      ];

      methods.forEach(({ method, scopes }) => {
        addLog(`Probando: ${method}`);
        window.AlipayJSBridge.call(`getUser${method}AuthCode`, {
          usage: 'Toka Arena necesita verificar tu identidad',
          scopes,
          success: (res: Record<string, unknown>) => {
            const code = (res.result ?? res.authCode ?? res.code) as string;
            addLog(`✅ ${method}: ${code}`);
            if (!gotCode.current && code) {
              gotCode.current = true;
              // Forzar actualización fuera del ciclo de Alipay
              setTimeout(() => setAuthCode(code), 0);
            }
          },
          fail: (err: unknown) => {
            addLog(`❌ ${method}: ${JSON.stringify(err)}`);
          },
        });
      });
    };

    if (window.AlipayJSBridge) {
      run();
    } else {
      document.addEventListener('AlipayJSBridgeReady', run, false);
      return () => document.removeEventListener('AlipayJSBridgeReady', run, false);
    }
  }, []);

  return (
    <div style={{ padding: 16 }}>
      <h1>Login</h1>
      {authCode
        ? <p style={{ color: 'green', fontSize: 20 }}>✅ AuthCode: {authCode}</p>
        : <p>Obteniendo código...</p>
      }
      <div style={{ marginTop: 16 }}>
        {log.map((l, i) => (
          <p key={i} style={{ fontSize: 12, color: 'gray', margin: 2 }}>{l}</p>
        ))}
      </div>
    </div>
  );
}