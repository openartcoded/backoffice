export interface Script {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  consumeEvent: boolean;
}
export interface UserScript {
  id?: string;
  content: string;
  creationDate?: Date;
  updatedDate?: Date;
}
