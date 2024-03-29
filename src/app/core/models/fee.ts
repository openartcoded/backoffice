import { FileUpload } from '@core/models/file-upload';

export interface Fee {
  id: string;
  dateCreation: Date;
  updatedDate: Date;
  date: Date;
  subject: string;
  body: string;
  attachmentIds: string[];
  attachments?: FileUpload[];
  archived: boolean;
  archivedDate?: Date;
  tag?: string;
  tagId?: string;
  priceHVAT?: number;
  vat?: number;
  priceTot?: number;
  imported?: boolean;
  importedDate?: Date;
}

export interface FeeUpdatePriceRequest {
  id: string;
  priceHVAT: number;
  vat: number;
}

export interface Label {
  id: string;
  name?: string;
  colorHex?: string;
  description?: string;
  priceHVAT?: number;
  vat?: number;
  noDefaultPrice?: boolean;
}

export interface FeeSearchCriteria {
  id?: string;
  dateBefore?: Date;
  dateAfter?: Date;
  subject?: string;
  body?: string;
  archived: boolean;
  tag?: string;
}

export interface FeeManualForm {
  subject: string;
  body: string;
  files: File[];
}

export interface FeeSummary {
  tag?: string;
  totalHVAT?: number;
  totalVAT?: number;
}
