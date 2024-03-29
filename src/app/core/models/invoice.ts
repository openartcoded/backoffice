import { FileUpload } from '@core/models/file-upload';
import { PlotlyGraph } from '@core/models/plotly-graph';
import { RateType } from './common';

export interface InvoiceSummary {
  graphs: PlotlyGraph[];
  totalAmountOfWork: number;
  totalExclVat: number;
  totalInvoices: number;
  invoicesGroupByYear: Map<number, InvoicePerYearSummary>
}

export interface InvoicePerYearSummary {
  totalAmountOfWork: number;
  totalExclVat: number;
  numberOfInvoices: number;
}

export interface BackendInvoiceSummary {
  period?: string;
  amount?: number;
  hoursPerDay?: number;
  client?: string;
  amountType?: string;
  subTotal?: number;
  dateOfInvoice?: Date;
}

export interface Invoice {
  id?: string;
  timesheetId?: string;
  seqInvoiceNumber?: number;
  invoiceNumber?: string;
  newInvoiceNumber?: string;
  maxDaysToPay?: number;
  dateOfInvoice?: Date;
  dateCreation?: Date;
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
  imported?: boolean;
  importedDate?: Date;
  specialNote?: string;
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
  amountType?: RateType;
  rateType?: RateType;
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

export interface InvoiceForm {
  invoice: Invoice;
  manualUploadFile?: File;
}
