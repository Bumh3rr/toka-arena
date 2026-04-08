export default function AuthCode() {
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
    try {
      const authCode = await getAuthCode('DigitalIdentity', [
        'USER_ID',
        'USER_AVATAR',
        'USER_NICKNAME',
      ]);
      console.log('AuthCode obtenido:', authCode);
      // mostrar en pantalla
      alert(`AuthCode: ${authCode}`);
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