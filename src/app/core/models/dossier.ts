import { Fee } from '@core/models/fee';
import { Invoice } from '@core/models/invoice';

export interface Dossier {
  id?: string;
  creationDate?: Date;
  updatedDate?: Date;
  name: string;
  tvaDue?: number;
  advancePayments?: TvaAdvancePayment[];
  description?: string;
  feeIds?: string[];
  fees?: Fee[];
  invoiceIds?: string[];
  documentIds?: string[];
  invoices?: Invoice[];
  closed?: boolean;
  closedDate?: Date;
  recalledForModification?: boolean;
  tvaToBePaid?: number;
  recalledForModificationDate?: Date;
  dossierUploadId?: string;
  imported?: boolean;
  importedDate?: Date;
  bookmarked?: boolean;
}

export interface TvaAdvancePayment {
  datePaid?: Date;
  advance?: number;
}

export interface DossierSummary {
  // dossier?: Dossier;
  closedDate: Date;
  name?: string;
  totalExpenses?: number;
  computedTotalExpensesPerTag?: Map<string, number>;
  totalEarnings?: number;
}
