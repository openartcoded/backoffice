import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DossierService } from '@core/service/dossier.service';
import { Dossier } from '@core/models/dossier';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DossierFormComponent } from '../dossier-form/dossier-form.component';
import { FileService } from '@core/service/file.service';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { LabelService } from '@core/service/label.service';
import { Fee, Label } from '@core/models/fee';
import { ToastService } from '@core/service/toast.service';
import { DossierImportFormComponent } from '../dossier-import-form/dossier-import-form.component';
import { Direction, Page, SortCriteria } from '@core/models/page';
import { MailService } from '@core/service/mail.service';
import { MailFormComponent } from '@shared/mail-form/mail-form.component';
import { MailRequest } from '@core/models/mail-request';
import { firstValueFrom } from 'rxjs';
import { Invoice } from '@core/models/invoice';

@Component({
  selector: 'app-dossier-table-result',
  templateUrl: './dossier-table-result.component.html',
  styleUrls: ['./dossier-table-result.component.scss'],
})
export class DossierTableResultComponent implements OnInit {
  @Input()
  closed: boolean;
  dossiers: Page<Dossier>;
  pageSize: number = 5;

  sort: SortCriteria = {
    direction: Direction.DESC,
    property: 'updatedDate',
  };

  labels: Label[];

  constructor(
    private dossierService: DossierService,
    private labelService: LabelService,
    private fileService: FileService,
    @Inject(PLATFORM_ID) private platformId: any,
    private toastService: ToastService,
    private windowRefService: WindowRefService,
    private modalService: NgbModal,
    private mailService: MailService
  ) { }

  ngOnInit(): void {
    this.load();
    this.loadLabels();
  }

  load(event: number = 1): void {
    this.dossierService
      .findAllWithPage(this.closed, event, this.pageSize, this.sort)
      .subscribe((d) => (this.dossiers = d));
  }

  loadLabels() {
    this.labelService.findAll().subscribe((labels) => (this.labels = labels));
  }

  newDossier() {
    this.openDossier();
  }
  newDossierFromPrevious() {
    this.dossierService.fromPrevious().subscribe((dossier: Dossier) => {
      this.openDossier(dossier, false);
    });
  }

  importDossier() {
    const modalRef = this.modalService.open(DossierImportFormComponent, {
      size: 'sm',
      scrollable: false,
    });
    modalRef.componentInstance.onUpload.subscribe((file) => {
      this.dossierService.import(file).subscribe();
      this.toastService.showSuccess('Dossier(s) will be imported.');
      modalRef.close();
    });
    modalRef.componentInstance.onGetExample.subscribe(() => {
      this.dossierService.importExample();
    });
  }
  openDossier(
    doss: Dossier = { name: null, advancePayments: [] },
    recallForModification: boolean = false
  ): NgbModalRef {
    const modalRef = this.modalService.open(DossierFormComponent, {
      size: 'xl',
      scrollable: true,
    });
    modalRef.componentInstance.dossier = doss;
    modalRef.componentInstance.labels = this.labels;
    modalRef.componentInstance.recallForModification = recallForModification;
    modalRef.componentInstance.onDownloadSummary.subscribe((dossier: Dossier) => {
      if (dossier.id) {
        // modalRef.close();
        this.dossierService.generateSummary(dossier.id);
      }
    });
    modalRef.componentInstance.submitted.subscribe((dossier: Dossier) => {
      if (dossier.id) {
        if (!dossier.closed) {
          this.dossierService.updateDossier(dossier).subscribe((savedDossier) => {
            this.load();
            modalRef.componentInstance.dossier = savedDossier;
            this.toastService.showSuccess('Dossier updated');
            // modalRef.close();
          });
        } else if (modalRef.componentInstance.recallForModification) {
          this.dossierService.recallForModification(dossier).subscribe((savedDossier) => {
            this.load();
            modalRef.componentInstance.dossier = savedDossier;
            this.toastService.showSuccess('Dossier updated');
            //  modalRef.close();
          });
        }
      } else {
        this.dossierService.newDossier(dossier).subscribe((savedDossier: Dossier) => {
          this.load();
          modalRef.componentInstance.dossier = savedDossier;
          this.toastService.showSuccess('Dossier created');
          //  modalRef.close();
        });
      }
    });
    modalRef.componentInstance.feeRemoved.subscribe((fee: Fee) => {
      this.dossierService.removeFee(fee.id).subscribe((savedDossier) => {
        this.toastService.showSuccess('Expense removed');
        modalRef.componentInstance.dossier = savedDossier;
        modalRef.componentInstance.loadFees();
        modalRef.componentInstance.loadInvoices();
        this.load();
      });
    });
    modalRef.componentInstance.invoiceRemoved.subscribe((invoice: Invoice) => {
      this.dossierService.removeInvoice(invoice.id).subscribe((savedDossier) => {
        this.toastService.showSuccess('Invoice removed');
        modalRef.componentInstance.dossier = savedDossier;
        modalRef.componentInstance.loadInvoices();
        modalRef.componentInstance.loadFees();
        this.load();
      });
    });
    return modalRef;
  }

  closeActiveDossier() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to close the dossier?')) {
        this.toastService.showSuccess('Dossier closed. Generating ZIP');
        this.dossierService.closeActiveDossier().subscribe((d) =>
          this.downloadArchive(d.dossierUploadId, () => {
            this.load();
          })
        );
      }
    }
  }

  downloadArchive(dossierUploadId: string, callback = () => { }) {
    this.fileService.findById(dossierUploadId).subscribe((zip) => {
      this.fileService.download(zip);
      callback();
    });
  }

  async sendMail(dossierUploadId: string) {
    const upload = await firstValueFrom(this.fileService.findById(dossierUploadId));
    const ngbModalRef = this.modalService.open(MailFormComponent, {
      size: 'md',
    });
    ngbModalRef.componentInstance.attachments = [upload];
    ngbModalRef.componentInstance.sendMail.subscribe(async (mailRequest: MailRequest) => {
      ngbModalRef.close();
      await firstValueFrom(this.mailService.send(mailRequest));
      this.toastService.showSuccess('Mail will be send');
    });
  }

  deleteDossier() {
    this.dossierService.deleteActiveDossier().subscribe((_d) => {
      this.load();
    });
  }

  modify(d: Dossier) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to modify the dossier?')) {
        this.openDossier(d, true);
      }
    }
  }
}
