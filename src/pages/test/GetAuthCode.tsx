import { tokaAuth, isInsideToka } from '../../services/tokaAuth';
import { useState, useEffect } from 'react';

export default function GetAuthCode() {
  const [authCode, setAuthCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isInsideToka()) {
      setError('Fuera de Toka, modo dev');
      return;
    }

    tokaAuth.getDigitalIdentityAuthCode()
      .then((code) => setAuthCode(code))
      .catch((err) => setError(String(err)));
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