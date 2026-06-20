/*
 * src/features/auth/model/toka.ts
 * Tipos relacionados con la autenticación en Toka
 * Incluye los métodos de autenticación disponibles, los scopes asociados a cada método y la estructura de la respuesta del bridge de autenticación.
 */

// Metodos de autenticación disponibles en Toka
export type AuthCodeMethod =
  | "DigitalIdentity"
  | "ContactInformation"
  | "AddressInformation"
  | "PersonalInformation"
  | "KYCStatus";

// Scopes disponibles para cada método de autenticación
export type DigitalIdentityScope = "USER_ID" | "USER_AVATAR" | "USER_NICKNAME";
export type ContactInformationScope =
  | "PLAINTEXT_MOBILE_PHONE"
  | "PLAINTEXT_EMAIL_ADDRESS";
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

// Mapeo de métodos a sus scopes correspondientes
export type AuthCodeScopeMap = {
  DigitalIdentity: DigitalIdentityScope;
  ContactInformation: ContactInformationScope;
  AddressInformation: AddressInformationScope;
  PersonalInformation: PersonalInformationScope;
  KYCStatus: KYCStatusScope;
};

// Respuesta de autenticación del bridge
export interface BridgeAuthCodeResponse {
  result: string;
  resultCode: number;
  resultMsg: string;
}
