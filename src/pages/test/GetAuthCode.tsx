import { useState, useEffect } from 'react';

export default function GetAuthCode() {
  const [lines, setLines] = useState<string[]>(['Iniciando...']);

  const add = (msg: string) => setLines(prev => [...prev, msg]);

  useEffect(() => {
    const run = () => {
      add('✅ Bridge detectado');

      window.AlipayJSBridge.call('getAuthCode', {
        scopeNicks: ['auth_user'],
        success: (res: Record<string, unknown>) => {
          add('✅ SUCCESS');
          add(JSON.stringify(res));
        },
        fail: (err: unknown) => {
          add('❌ FAIL');
          add(JSON.stringify(err));
        },
      });

      add('✅ Call enviado...');
    };

    if (window.AlipayJSBridge) {
      run();
    } else {
      add('⏳ Esperando bridge...');
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