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
    addLog(`window.AlipayJSBridge: ${!!window.AlipayJSBridge}`);
    addLog(`userAgent: ${navigator.userAgent}`);

    const run = () => {
      addLog('Bridge listo, llamando getAuthCode...');
      window.AlipayJSBridge.call('getUserKYCStatusAuthCode', {
        usage: 'Toka Arena necesita verificar tu identidad',
        scopes: ['USER_KYC_STATUS'],
        success: (res: Record<string, unknown>) => {
          addLog(`success: ${JSON.stringify(res)}`);
          setAuthCode(res.result as string);
        },
        fail: (err: unknown) => {
          addLog(`fail: ${JSON.stringify(err)}`);
          setError(String(err));
        },
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
    <div>
      <h1>Login</h1>
      {authCode && <p>AuthCode: {authCode}</p>}
      {error && <p>Error: {error}</p>}
      {log.map((l, i) => <p key={i} style={{ fontSize: 12, color: 'gray' }}>{l}</p>)}
    </div>
  );
}