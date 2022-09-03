import { RateType } from "./common";

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
  }

  export enum ContractStatus{
    NOT_STARTED_YET,
    ONGOING,
    DONE
  }