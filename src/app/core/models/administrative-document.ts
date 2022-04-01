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
}

export interface AdministrativeDocumentSearchCriteria {
  id?: string;
  dateBefore?: Date;
  dateAfter?: Date;
  title?: string;
  description?: string;
  tags?: string[];
}

export interface AdministrativeDocumentForm {
  title: string;
  description?: string;
  document?: File;
  id?: string;
  tags?: string[];
}
