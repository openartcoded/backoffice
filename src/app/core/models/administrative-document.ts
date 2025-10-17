import { FileUpload } from '@core/models/file-upload';

export interface AdministrativeDocument {
  id?: string;
  dateCreation?: Date;
  updatedDate?: Date;
  title: string;
  description?: string;
  tags?: string[];
  attachmentId?: string;
  attachment?: FileUpload;
  //2025-10-16 23:48 introduced as an experiment in invoice and fee, genearlized elsewhere
  bookmarked?: boolean;
  locked?: boolean;
}

export interface AdministrativeDocumentSearchCriteria {
  id?: string;
  dateBefore?: Date;
  dateAfter?: Date;
  title?: string;
  description?: string;
  tags?: string[];
  bookmarked: boolean;
}

export interface AdministrativeDocumentForm {
  title: string;
  description?: string;
  document?: File;
  id?: string;
  tags?: string[];
}
