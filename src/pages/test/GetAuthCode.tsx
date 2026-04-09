import { useState, useEffect } from 'react';

export default function GetAuthCode() {
  const [lines, setLines] = useState<string[]>(['Iniciando...']);

  const add = (msg: string) => setLines(prev => [...prev, msg]);

  useEffect(() => {
    const run = () => {
      add('✅ Bridge detectado');

      const methods = [
        { method: 'DigitalIdentity', scopes: ['USER_ID', 'USER_AVATAR', 'USER_NICKNAME'] },
        { method: 'ContactInformation', scopes: ['PLAINTEXT_MOBILE_PHONE', 'PLAINTEXT_EMAIL_ADDRESS'] },
        { method: 'AddressInformation', scopes: ['USER_ADDRESS'] },
        { method: 'PersonalInformation', scopes: ['USER_NAME', 'USER_FIRST_SURNAME'] },
        { method: 'KYCStatus', scopes: ['USER_KYC_STATUS'] },
      ];

      methods.forEach(({ method, scopes }) => {
        // @ts-ignore
        my.call(`getUser${method}AuthCode`, {
          usage: 'Toka Arena necesita verificar tu identidad',
          scopes,
          success: (res: Record<string, unknown>) => {
            add(`✅ ${method}: ${JSON.stringify(res)}`);
          },
          fail: (err: unknown) => {
            add(`❌ ${method}: ${JSON.stringify(err)}`);
          },
        });
        add(`📤 enviado: ${method}`);
      });
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
          fontSize: 13,
          padding: '3px 0',
          borderBottom: '1px solid #eee',
          color: l.startsWith('❌') ? 'red' : l.startsWith('✅') ? 'green' : 'black'
        }}>
          {l}
        </div>
      ))}
    </div>
  );
}