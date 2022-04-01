import { FileUpload } from '@core/models/file-upload';
import { PlotlyGraph } from '@core/models/plotly-graph';

export interface InvoiceSummary {
  graphs: PlotlyGraph[];
  totalAmountOfWork: number;
  totalInvoicesThisYear: number;
  totalAmountOfWorkThisYear: number;
  totalExclVat: number;
  totalExclVatThisYear: number;
  numberOfInvoicesThisYear: number;
}

export interface Invoice {
  id?: string;
  invoiceNumber?: string;
  maxDaysToPay?: number;
  dateOfInvoice?: Date;
  dueDate?: Date;
  billTo?: BillTo;
  invoiceTable?: InvoiceRow[];
  locked?: boolean;
  archived?: boolean;
  freemarkerTemplateId?: string;
  logicalDelete?: boolean;
  uploadedManually?: boolean;
  invoiceUploadId?: string;
  subTotal?: number;
  taxable?: number;
  taxes?: number;
  total?: number;
  taxRate?: number;
}

export interface InvoiceFreemarkerTemplate {
  id?: string;
  name?: string;
  templateUploadId?: string;
  template?: FileUpload;
  dateCreation?: string;
}

export interface InvoiceRow {
  projectName?: string;
  period?: string;
  nature?: string;
  total?: number;
  hoursPerDay?: number;
  amountType?: InvoicingType;
  rateType?: InvoicingType;
  amount?: number;
  rate?: number;
}

export interface BillTo {
  vatNumber?: string;
  address?: string;
  emailAddress?: string;
  city?: string;
  clientName?: string;
}

export interface CurrentBillTo {
  billTo: BillTo;
  maxDaysToPay: number;
  rateType?: InvoicingType;
  rate?: number;
  id?: string;
  projectName?: string;
}

export enum InvoicingType {
  DAYS,
  HOURS,
}

export interface InvoiceForm {
  invoice: Invoice;
  manualUploadFile?: File;
}
