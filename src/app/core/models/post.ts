import { FileUpload } from './file-upload';
import { PostIt } from './postit';

export interface Post {
  author?: string;
  description: string;
  id?: string;
  unreadCount?: number;
  title: string;
  priority?: Priority;
  dueDate?: Date;
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
export interface UnreadMessagesCounter {
  status: PostStatus;
  subscriber: string;
  counter: number;
}
export function getDueDateEmoji(status: PostStatus, due?: Date | string): string {
  if (!due || status === 'DONE' || status === 'CANCELLED') {
    return '👍 On track';
  }
  const dueDate = new Date(due);
  const today = new Date();
  const timeDiff = dueDate.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  if (daysDiff < 0) {
    return '⛔ ' + Math.abs(daysDiff) + ' days overdue';
  } else if (daysDiff === 0) {
    return '🔶 Last day before due date!';
  } else if (daysDiff <= 5) {
    return '⚠️ ' + daysDiff + ' days left before due date';
  } else {
    return daysDiff + ' days left before due date';
  }
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
