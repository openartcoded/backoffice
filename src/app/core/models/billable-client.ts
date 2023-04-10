import { RateType } from './common';
import { FileUpload } from './file-upload';

export interface BillableClient {
  id?: string;
  maxDaysToPay?: number;
  rate?: number;
  taxRate?: number;
  nature?: string;
  rateType?: RateType;
  projectName?: string;
  vatNumber?: string;
  address?: string;
  city?: string;
  name?: string;
  emailAddress?: string;
  phoneNumber?: string;
  contractStatus?: ContractStatus;
  startDate?: Date;
  endDate?: Date;
  documentIds?: string[];
  documents?: FileUpload[];
  imported?: boolean;
  importedDate?: Date;
  defaultWorkingDays: DefaultWorkingDay[];
}

export function getAllDays(): { name: string; value: string }[] {
  return [
    {
      name: DefaultWorkingDay[DefaultWorkingDay.MONDAY].toLowerCase(),
      value: DefaultWorkingDay[DefaultWorkingDay.MONDAY],
    },
    {
      name: DefaultWorkingDay[DefaultWorkingDay.TUESDAY].toLowerCase(),
      value: DefaultWorkingDay[DefaultWorkingDay.TUESDAY],
    },
    {
      name: DefaultWorkingDay[DefaultWorkingDay.WEDNESDAY].toLowerCase(),
      value: DefaultWorkingDay[DefaultWorkingDay.WEDNESDAY],
    },
    {
      name: DefaultWorkingDay[DefaultWorkingDay.THURSDAY].toLowerCase(),
      value: DefaultWorkingDay[DefaultWorkingDay.THURSDAY],
    },
    {
      name: DefaultWorkingDay[DefaultWorkingDay.FRIDAY].toLowerCase(),
      value: DefaultWorkingDay[DefaultWorkingDay.FRIDAY],
    },
  ];
}

export enum DefaultWorkingDay {
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
}

export enum ContractStatus {
  NOT_STARTED_YET,
  ONGOING,
  DONE,
}
