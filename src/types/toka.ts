import type { Accesorio } from "./accesorios";
// Rareza
export type Rareza = "Común" | "Raro" | "Épico" | "Legendario";

// Especie
export type Especie = "tofu" | "mochi" | "hana";

// Animaciones disponibles
export type TokagotchiAnimacion =
  | "idle"
  | "feed"
  | "play"
  | "heal"
  | "bath"
  | "attack"
  | "hurt"
  | "ko"
  | "win"
  | "battle_idle";

// Stats base con jitter aplicado
export interface TokagotchiStats {
  hp: number;
  atk: number;
  def: number;
  nrg: number; // siempre empieza en 100 en combate
}

// Habilidad
export interface Habilidad {
  id: string;
  nombre: string;
  costoNRG: number;
  multiplicador?: number; // para daño
  descripcion: string;
  esSignature: boolean;
}

// Tokagotchi completo
export interface Tokagotchi {
  id: string;
  nombre: string;
  especie: Especie;
  rareza: Rareza;
  stats: TokagotchiStats;
  habilidades: Habilidad[];
  accesorios: {
    cabeza: Accesorio | null;
    cuerpo: Accesorio | null;
  };
  // Assets DragonBones
  assets: {
    texPng: string;
    texJson: string;
    skeJson: string;
    armatureKey: string;
  };
}

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