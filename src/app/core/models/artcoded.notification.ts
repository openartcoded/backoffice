export interface ArtcodedNotification {
  id: string;
  receivedDate: Date;
  seen: boolean;
  title: string;
  type: string;
  correlationId?: string;
}
