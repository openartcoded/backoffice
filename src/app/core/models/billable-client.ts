import { RateType } from "./common";
import { FileUpload } from "./file-upload";

export interface BillableClient {
    id?: string;
    maxDaysToPay?: number;
    rate?: number;
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
  }

  export enum ContractStatus{
    NOT_STARTED_YET,
    ONGOING,
    DONE
  }