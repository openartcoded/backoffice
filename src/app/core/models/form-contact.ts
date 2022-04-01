export interface FormContact {
  id?: string;
  fullName: string;
  bestTimeToCall: string;
  email: string;
  phoneNumber: string;
  subject: string;
  body: string;
  creationDate?: Date;
}
