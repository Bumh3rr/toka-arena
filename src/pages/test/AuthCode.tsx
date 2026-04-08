import { useState } from 'react';
import { tokaAuth } from '../../services/tokaAuth';

export default function AuthCode() {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGetAuthCode = async () => {
    try {
      await tokaAuth.waitForBridge();

      const code = await Promise.race([
        tokaAuth.getDigitalIdentityAuthCode(),
        new Promise<string>((_, reject) => {
          setTimeout(() => reject(new Error('Timeout solicitando authCode')), 10000);
        }),
      ]);

      console.log('AuthCode obtenido:', code);
      setAuthCode(code);
    } catch (err) {
      console.error('Error obteniendo authCode:', err);
    }
  };

  return (
    <button onClick={handleGetAuthCode}>
      Obtener código de autenticación
    </button>
  );
}