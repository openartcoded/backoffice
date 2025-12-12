export interface MailRequest {
  to: string[];
  subject: string;
  body: string;
  bcc: boolean;
  uploadIds: string[];
  sendingDate?: string;
}
export interface MailJob {
  id: string;
  createdDate: Date;
  updatedDate?: Date;
  sent: boolean;
  sendingDate?: Date;
  markedFailed?: boolean;
  markedFailedMessage?: string;
  to: string[];
  subject: string;
  body: string;
  bcc: boolean;
  uploadIds: string[];
}
export type MailContextType = string | number | boolean;
