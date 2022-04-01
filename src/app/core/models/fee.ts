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
  tag?: FeeTag;
  priceHVAT?: number;
  vat?: number;
  priceTot?: number;
}

export interface FeeUpdatePriceRequest {
  id: string;
  priceHVAT: number;
  vat: number;
}

export interface DefaultPriceForTag {
  id: string;
  dateCreation?: Date;
  updatedDate?: Date;
  tag?: FeeTag;
  priceHVAT?: number;
  vat?: number;
}

export interface FeeSearchCriteria {
  id?: string;
  datebefore?: Date;
  dateAfter?: Date;
  subject?: string;
  body?: string;
  archived: boolean;
  tag?: FeeTag;
}

export enum FeeTag {
  INTERNET = 'INTERNET',
  GSM = 'GSM',
  OIL = 'OIL',
  LEASING = 'LEASING',
  ACCOUNTING = 'ACCOUNTING',
  OTHER = 'OTHER',
  TIMESHEET = 'TIMESHEET',
}

export interface FeeManualForm {
  subject: string;
  body: string;
  files: File[];
}

export interface FeeTagColor {
  tag: FeeTag;
  label: string;
  color: string;
}

export class FeeTagColorUtils {
  static tags(): FeeTagColor[] {
    return [
      {
        tag: FeeTag.ACCOUNTING,
        label: FeeTag[FeeTag.ACCOUNTING],
        color: 'text-success',
      },
      {
        tag: FeeTag.OTHER,
        label: FeeTag[FeeTag.OTHER],
        color: 'text-secondary',
      },
      {
        tag: FeeTag.GSM,
        label: FeeTag[FeeTag.GSM],
        color: 'text-info',
      },
      {
        tag: FeeTag.LEASING,
        label: FeeTag[FeeTag.LEASING],
        color: 'text-danger',
      },
      {
        tag: FeeTag.INTERNET,
        label: FeeTag[FeeTag.INTERNET],
        color: 'text-primary',
      },
      {
        tag: FeeTag.OIL,
        label: 'GAS',
        color: 'text-dark',
      },
      /*{ 
        tag: FeeTag.TIMESHEET,
        label: FeeTag[FeeTag.TIMESHEET],
        color: 'text-warning',
      },*/
    ];
  }

  static getClassForTag(f: Fee) {
    if (!f.tag) {
      return 'text-light';
    }
    let tagColor = FeeTagColorUtils.tags().find((t) => t.tag === f.tag);

    return tagColor?.color || 'text-secondary';
  }
}
