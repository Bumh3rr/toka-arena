export type AuthCodeMethod =
  | 'DigitalIdentity'
  | 'ContactInformation'
  | 'AddressInformation'
  | 'PersonalInformation'
  | 'KYCStatus'

export type DigitalIdentityScope = 'USER_ID' | 'USER_AVATAR' | 'USER_NICKNAME'
export type ContactInformationScope = 'PLAINTEXT_MOBILE_PHONE' | 'PLAINTEXT_EMAIL_ADDRESS'
export type AddressInformationScope = 'USER_ADDRESS'
export type PersonalInformationScope =
  | 'USER_NAME'
  | 'USER_FIRST_SURNAME'
  | 'USER_SECOND_SURNAME'
  | 'USER_GENDER'
  | 'USER_BIRTHDAY'
  | 'USER_STATE_OF_BIRTH'
  | 'USER_NATIONALITY'
export type KYCStatusScope = 'USER_KYC_STATUS'

export type AuthCodeScopeMap = {
  DigitalIdentity: DigitalIdentityScope
  ContactInformation: ContactInformationScope
  AddressInformation: AddressInformationScope
  PersonalInformation: PersonalInformationScope
  KYCStatus: KYCStatusScope
}

export interface BridgeAuthCodeResponse {
  result: string
  resultCode: number
  resultMsg: string
}