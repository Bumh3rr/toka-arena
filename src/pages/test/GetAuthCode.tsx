import { useState, useEffect } from 'react';

export default function GetAuthCode() {
  const [lines, setLines] = useState<string[]>(['Iniciando...']);

  const add = (msg: string) => setLines(prev => [...prev, msg]);

  useEffect(() => {
    const run = () => {
      add('✅ Bridge detectado');

      window.AlipayJSBridge.call('getUserKYCStatusAuthCode', {
        usage: 'Toka Arena necesita verificar tu identidad',
        scopes: ['USER_KYC_STATUS'],
        success: (res: Record<string, unknown>) => {
          add('✅ SUCCESS llamado');
          add(JSON.stringify(res));
        },
        fail: (err: unknown) => {
          add('❌ FAIL llamado');
          add(JSON.stringify(err));
        },
      });

      add('✅ Call enviado, esperando respuesta...');
    };

    if (window.AlipayJSBridge) {
      run();
    } else {
      add('⏳ Esperando AlipayJSBridgeReady...');
      document.addEventListener('AlipayJSBridgeReady', run, false);
      return () => document.removeEventListener('AlipayJSBridgeReady', run, false);
    }
  }, []);

  return (
    <div style={{ padding: 16, fontFamily: 'monospace' }}>
      <h2>Debug</h2>
      {lines.map((l, i) => (
        <div key={i} style={{
          fontSize: 14,
          padding: '4px 0',
          borderBottom: '1px solid #eee',
          color: l.startsWith('❌') ? 'red' : l.startsWith('✅') ? 'green' : 'black'
        }}>
          {l}
        </div>
      ))}
    </div>
  );
}