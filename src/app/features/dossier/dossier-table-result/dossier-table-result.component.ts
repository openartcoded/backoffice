import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { DossierService } from '@core/service/dossier.service';
import { Dossier } from '@core/models/dossier';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { DossierFormComponent } from '../dossier-form/dossier-form.component';
import { FileService } from '@core/service/file.service';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-dossier-table-result',
  templateUrl: './dossier-table-result.component.html',
  styleUrls: ['./dossier-table-result.component.scss'],
})
export class DossierTableResultComponent implements OnInit {
  @Input()
  closed: boolean;
  dossiers: Dossier[];
  showGraphs = false;

  constructor(
    private dossierService: DossierService,
    private fileService: FileService,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private modalService: NgbModal
  ) {
  }



  toggleGraphs() {
    this.showGraphs = !this.showGraphs;
  }
  
  ngOnInit(): void {
    this.load();
    setTimeout(()=> this.showGraphs = true, 200);
  }

  load(): void {
    this.dossierService.findAll(this.closed).subscribe((d) => (this.dossiers = d));
  }

  newDossier() {
    this.openDossier();
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
    modalRef.componentInstance.recallForModification = recallForModification;
    modalRef.componentInstance.onDownloadSummary.subscribe((dossier) => {
      if (dossier.id) {
        modalRef.close();
        this.dossierService.generateSummary(dossier.id);
      }
    });
    modalRef.componentInstance.submitted.subscribe((dossier) => {
      if (dossier.id) {
        if (!dossier.closed) {
          this.dossierService.updateDossier(dossier).subscribe((dossier) => {
            this.load();
            modalRef.close();
          });
        } else if (modalRef.componentInstance.recallForModification) {
          this.dossierService.recallForModification(dossier).subscribe((dossier) => {
            this.load();
            modalRef.close();
          });
        }
      } else {
        this.dossierService.newDossier(dossier).subscribe((dossier) => {
          this.load();
          modalRef.close();
        });
      }
    });
    modalRef.componentInstance.feeRemoved.subscribe((fee) => {
      this.dossierService.removeFee(fee.id).subscribe((dossier) => {
        modalRef.componentInstance.dossier = dossier;
        modalRef.componentInstance.loadFees();
        modalRef.componentInstance.loadInvoices();
        this.load();
      });
    });
    modalRef.componentInstance.invoiceRemoved.subscribe((invoice) => {
      this.dossierService.removeInvoice(invoice.id).subscribe((dossier) => {
        modalRef.componentInstance.dossier = dossier;
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
        this.dossierService.closeActiveDossier().subscribe((d) =>
          this.downloadArchive(d.dossierUploadId, () => {
            this.load();
            this.showGraphs = false;
            setTimeout(() => {
              this.showGraphs = true;
            }, 100);
          })
        );
      }
    }
  }

  downloadArchive(dossierUploadId: string, callback = () => {}) {
    this.fileService.findById(dossierUploadId).subscribe((zip) => {
      this.fileService.download(zip);
      callback();
    });
  }

  deleteDossier() {
    this.dossierService.deleteActiveDossier().subscribe((d) => {
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
