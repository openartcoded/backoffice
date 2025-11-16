import { FileUpload } from './file-upload';
import { PostIt } from './postit';

export interface Post {
  author?: string;
  description: string;
  id?: string;
  title: string;
  priority?: Priority;
  bookmarked?: boolean;
  content?: string;
  creationDate?: Date;
  attachmentIds?: string[];
  processedAttachmentIds?: string[];
  attachments?: FileUpload[];
  updatedDate?: Date;
  coverId?: string;
  tags?: string[];
  channelId?: string;
  status?: PostStatus;
  todos?: PostIt[];
  inProgress?: PostIt[];
  done?: PostIt[];
}

export interface Channel {
  id: string;
  subscribers: string[];
  messages: Message[];
  creationDate: Date;
  correlationId?: string;
  updatedDate?: Date;
}

export interface Message {
  id?: string;
  creationDate?: Date;
  emailFrom?: string;
  content?: string;
  attachmentIds?: string[];
  attachments?: FileUpload[];
  read?: boolean;
}
export type PostItType = 'TODOS' | 'IN_PROGRESS' | 'DONE';

export interface PostSearchCriteria {
  id?: string;
  dateBefore?: Date;
  dateAfter?: Date;
  title?: string;
  priority?: Priority;
  content?: string;
  tag?: string;
  bookmarked?: boolean;
  status?: PostStatus;
}
export type PostStatus = 'DRAFT' | 'IN_PROGRESS' | 'PENDING' | 'DONE' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
