export interface PersonalInfo {
  id?: string;
  dateCreation?: Date;
  updatedDate?: Date;
  organizationName?: string;
  vatNumber?: string;
  organizationAddress?: string;
  organizationPostCode?: string;
  organizationCity?: string;
  organizationBankAccount?: string;
  organizationBankBIC?: string;
  organizationPhoneNumber?: string;
  organizationEmailAddress?: string;
  financeCharge?: number;
  ceoFullName?: string;
  note?: string;
  logoUploadId?: string;
  signatureUploadId?: string;
  initialUploadId?: string;
  maxDaysToPay?: number;
  accountants?: Accountant[];
}
export interface Accountant {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}
