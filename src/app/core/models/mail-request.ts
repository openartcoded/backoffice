export interface MailRequest {
  to: string[];
  subject: string;
  body: string;
  bcc: boolean;
  uploadIds: string[];
}
export type MailContextType = string | number | boolean;

