import { FileUpload } from './file-upload';
import { PostIt } from './postit';

export interface Post {
    author?: string;
    description: string;
    id?: string;
    title: string;
    content?: string;
    creationDate?: Date;
    attachmentIds?: string[];
    processedAttachmentIds?: string[];
    attachments?: FileUpload[];
    updatedDate?: Date;
    coverId?: string;
    tags?: string[];
    status?: PostStatus;
    todos?: PostIt[];
    inProgress?: PostIt[];
    done?: PostIt[];
}

export type PostItType = 'TODOS' | 'IN_PROGRESS' | 'DONE';

export interface PostSearchCriteria {
    id?: string;
    dateBefore?: Date;
    dateAfter?: Date;
    title?: string;
    content?: string;
    tag?: string;
    status?: PostStatus;
}
export type PostStatus = "IN_PROGRESS" | "PENDING" | "DONE";
