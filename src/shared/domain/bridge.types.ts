/**
 * Tipos de dominio relacionados con el bridge nativo de autenticación.
 *
 * Este archivo concentra:
 * - Los métodos de autenticación que expone la super app.
 * - Los scopes permitidos por cada método.
 * - La forma de la respuesta que retorna el bridge cuando se solicita un auth code.
 */

/** Métodos de autenticación disponibles en la super app Toka. */
export type AuthCodeMethod =
  | "DigitalIdentity"
  | "ContactInformation"
  | "AddressInformation"
  | "PersonalInformation"
  | "KYCStatus";

/**
 * Scopes disponibles para cada método de autenticación.
 *
 * Cada alias representa los permisos concretos que el usuario puede conceder
 * cuando el bridge solicita un auth code.
 */
export type DigitalIdentityScope = "USER_ID" | "USER_AVATAR" | "USER_NICKNAME";
export type ContactInformationScope = "PLAINTEXT_MOBILE_PHONE" | "PLAINTEXT_EMAIL_ADDRESS";
export type AddressInformationScope = "USER_ADDRESS";
export type PersonalInformationScope =
  | "USER_NAME"
  | "USER_FIRST_SURNAME"
  | "USER_SECOND_SURNAME"
  | "USER_GENDER"
  | "USER_BIRTHDAY"
  | "USER_STATE_OF_BIRTH"
  | "USER_NATIONALITY";
  export type KYCStatusScope = "USER_KYC_STATUS";

/**
 * Mapeo de método de autenticación -> scope permitido para ese método.
 * Se usa como base para tipar `getAuthCode(...)` y evitar scopes inválidos.
 */
export type AuthCodeScopeMap = {
  DigitalIdentity: DigitalIdentityScope;
  ContactInformation: ContactInformationScope;
  AddressInformation: AddressInformationScope;
  PersonalInformation: PersonalInformationScope;
  KYCStatus: KYCStatusScope;
};

/**
 * Respuesta del bridge al solicitar un auth code.
 *
 * `resultCode === 10000` indica éxito. En ese caso `result` contiene el auth
 * code que se enviará al backend.
 */
export interface BridgeAuthCodeResponse {
  /** Auth code emitido por la super app cuando la solicitud fue exitosa. */
  result: string;
  /** Código de resultado del bridge; 10000 significa éxito. */
  resultCode: number;
  /** Mensaje legible que explica el resultado o el motivo del error. */
  resultMsg: string;
}
