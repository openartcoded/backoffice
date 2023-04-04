export interface MailRequest {
  to: string[];
  subject: string;
  body: string;
  bcc: boolean;
  uploadIds: string[];
}
