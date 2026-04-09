import { useState, useEffect } from 'react';

export default function GetAuthCode() {
  const [lines, setLines] = useState<string[]>(['Iniciando...']);

  const add = (msg: string) => setLines(prev => [...prev, msg]);

  useEffect(() => {
    const run = () => {
      add('✅ Bridge detectado');

      // Patrón alternativo — llamada directa sin callbacks
      try {
        const result = window.AlipayJSBridge.call('getAuthCode', {
          scopeNicks: ['auth_user'],
        });
        add(`result: ${JSON.stringify(result)}`);
      } catch (e) {
        add(`❌ Error: ${JSON.stringify(e)}`);
      }

      // También probar con my directamente
      try {
            // @ts-ignore
            my.getAuthCode({
            scopes: ['auth_user'],  // array, no string
            success: (res: Record<string, unknown>) => {
                add(`✅ success: ${JSON.stringify(res)}`);
            },
            fail: (err: unknown) => {
                add(`❌ fail: ${JSON.stringify(err)}`);
            },
            });
        add('✅ my.getAuthCode enviado...');
      } catch (e) {
        add(`❌ my no disponible: ${JSON.stringify(e)}`);
      }
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