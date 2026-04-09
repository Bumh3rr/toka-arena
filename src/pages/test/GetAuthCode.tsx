import { getAuthCodeFromURL } from '../../services/tokaAuth';

export default function GetAuthCode() {
     const authCode = getAuthCodeFromURL();
    return (
        <div>
            <h1>Login</h1>
            {authCode ? (
                <p>AuthCode obtenido: {authCode}</p>
            ) : (
                <p>No se encontró el código de autenticación en la URL.</p>
            )}
        </div>
    );
}