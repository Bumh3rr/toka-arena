import { useState } from 'react';

export default function AuthCode() {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAuthCode = (
    method: 'DigitalIdentity' | 'ContactInformation' | 'AddressInformation' | 'PersonalInformation' | 'KYCStatus',
    scopes: string[]
  ): Promise<string> => {
    return new Promise((resolve, reject) => {
      window.AlipayJSBridge.call(`getUser${method}AuthCode`, {
        usage: 'Toka Arena necesita verificar tu identidad',
        scopes,
        success: (res) => resolve((res as { authCode: string }).authCode),
        fail: (err: unknown) => reject(err),
      });
    });
  };

  const handleGetAuthCode = async () => {
    setIsLoading(true);
    setError(null);
    setAuthCode(null);

    try {
      const code = await getAuthCode('DigitalIdentity', [
        'USER_ID',
        'USER_AVATAR',
        'USER_NICKNAME',
      ]);
      console.log('AuthCode obtenido:', code);
      setAuthCode(code);
    } catch (err) {
      console.error('Error obteniendo authCode:', err);
      setError('No se pudo obtener el código de autenticación. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleGetAuthCode} disabled={isLoading}>
        {isLoading ? 'Obteniendo...' : 'Obtener código de autenticación'}
      </button>

      {authCode && <p>AuthCode: {authCode}</p>}
      {error && <p>{error}</p>}
    </div>
  );
}