import { Component, EventEmitter, HostListener, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
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
import { MailContextType, MailRequest } from '@core/models/mail';
import { firstValueFrom, map } from 'rxjs';
import { Invoice } from '@core/models/invoice';
import { AdministrativeDocument } from '@core/models/administrative-document';
import { User } from '@core/models/user';

@Component({
    selector: 'app-dossier-table-result',
    templateUrl: './dossier-table-result.component.html',
    styleUrls: ['./dossier-table-result.component.scss'],
    standalone: false,
})
export class DossierTableResultComponent implements OnInit {
    @Input()
    closed: boolean;
    @Input()
    bookmarked: boolean;
    @Input()
    demoMode: boolean;
    dossiers: Page<Dossier>;
    pageSize: number = 10;
    @Input()
    user: User;

    get hasRoleAdmin(): boolean {
        return this.user.authorities.includes('ADMIN');
    }
    sort: SortCriteria = {
        direction: Direction.DESC,
        property: 'updatedDate',
    };

    labels: Label[];
    @HostListener('document:keydown', ['$event'])
    topKey(event: KeyboardEvent) {
        if (event.ctrlKey && event.key.toLowerCase() === 'k') {
            event.preventDefault();
            event.stopPropagation();
            this.newDossierFromPrevious();
        }
    }
    constructor(
        private dossierService: DossierService,
        private labelService: LabelService,
        private fileService: FileService,
        @Inject(PLATFORM_ID) private platformId: any,
        private toastService: ToastService,
        private windowRefService: WindowRefService,
        private modalService: NgbModal,
        private mailService: MailService,
    ) { }

    ngOnInit(): void {
        this.load();
        this.loadLabels();
    }

    load(event: number = 1): void {
        if (this.bookmarked) {
            this.dossierService.bookmarked(event, this.pageSize, this.sort).subscribe((d) => (this.dossiers = d));
        } else {
            this.dossierService
                .findAllWithPage(this.closed, event, this.pageSize, this.sort)
                .subscribe((d) => (this.dossiers = d));
        }
    }

    loadLabels() {
        this.labelService
            .findAll()
            .pipe(map((labels: Label[]) => labels.filter((l) => !l.hidden)))
            .subscribe((labels) => (this.labels = labels));
    }

    toggleBookmark($event: MouseEvent, dossier: Dossier) {
        $event.stopPropagation();
        this.dossierService.toggleBookmarked(dossier.id).subscribe((_) => {
            this.toastService.showSuccess('Bookmark toggled. Reload...');
            dossier.bookmarked = !dossier.bookmarked;
            const index = this.dossiers.content.findIndex((d) => d.id && d.id === dossier.id);
            if (index !== -1) {
                const newArray =
                    this.bookmarked && !dossier.bookmarked
                        ? this.dossiers.content.filter((x) => x.id !== dossier.id)
                        : this.dossiers.content.map((item, i) => (i === index ? dossier : item));
                this.dossiers.content = newArray;
            }
        });
    }

    newDossier() {
        if (!this.hasRoleAdmin) {
            return;
        }
        this.openDossier();
    }
    newDossierFromPrevious() {
        if (!this.hasRoleAdmin) {
            return;
        }
        this.dossierService.fromPrevious().subscribe((dossier: Dossier) => {
            this.openDossier(dossier, false);
        });
    }

    importDossier() {
        if (!this.hasRoleAdmin) {
            return;
        }
        const modalRef = this.modalService.open(DossierImportFormComponent, {
            size: 'sm',
            scrollable: false,
        });
        modalRef.componentInstance.onUpload.subscribe((file: any) => {
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
        recallForModification: boolean = false,
    ): NgbModalRef {
        const dossierUpdatedEmitter: EventEmitter<Dossier> = new EventEmitter<Dossier>();
        const modalRef = this.modalService.open(DossierFormComponent, {
            size: 'xl',
            scrollable: true,
            backdrop: 'static',
            keyboard: false,
        });

        modalRef.componentInstance.user = this.user;
        modalRef.componentInstance.demoMode = this.demoMode;
        modalRef.componentInstance.dossier = doss;
        modalRef.componentInstance.size$ = this.dossierService.size(doss.id);
        modalRef.componentInstance.dossierUpdatedEmitter = dossierUpdatedEmitter;
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
                        dossierUpdatedEmitter.emit(savedDossier);
                        this.toastService.showSuccess('Dossier updated');
                        // modalRef.close();
                    });
                } else if (modalRef.componentInstance.recallForModification) {
                    this.dossierService.recallForModification(dossier).subscribe((savedDossier: Dossier) => {
                        this.load();
                        dossierUpdatedEmitter.emit(savedDossier);
                        this.toastService.showSuccess('Dossier updated');
                        //  modalRef.close();
                    });
                }
            } else {
                this.dossierService.newDossier(dossier).subscribe((savedDossier: Dossier) => {
                    this.load();
                    dossierUpdatedEmitter.emit(savedDossier);
                    this.toastService.showSuccess('Dossier created');
                    //  modalRef.close();
                });
            }
        });
        modalRef.componentInstance.feeRemoved.subscribe((fee: Fee) => {
            this.dossierService.removeFee(fee.id).subscribe((savedDossier: Dossier) => {
                this.toastService.showSuccess('Expense removed');
                dossierUpdatedEmitter.emit(savedDossier);
                // modalRef.componentInstance.loadFees();
                // modalRef.componentInstance.loadInvoices();
                this.load();
            });
        });
        modalRef.componentInstance.documentRemoved.subscribe((d: AdministrativeDocument) => {
            this.dossierService.removeDocument(d.id).subscribe((savedDossier: Dossier) => {
                this.toastService.showSuccess('Document removed');
                dossierUpdatedEmitter.emit(savedDossier);
                this.load();
            });
        });
        modalRef.componentInstance.invoiceRemoved.subscribe((invoice: Invoice) => {
            this.dossierService.removeInvoice(invoice.id).subscribe((savedDossier) => {
                this.toastService.showSuccess('Invoice removed');
                dossierUpdatedEmitter.emit(savedDossier);
                // modalRef.componentInstance.loadInvoices();
                // modalRef.componentInstance.loadFees();
                this.load();
            });
        });
        return modalRef;
    }

    closeActiveDossier() {
        if (!this.hasRoleAdmin) {
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            if (this.windowRefService.nativeWindow.confirm('Are you sure you want to close the dossier?')) {
                this.toastService.showSuccess('Dossier closed. Generating ZIP');
                this.dossierService.closeActiveDossier().subscribe((d) =>
                    this.downloadArchive(d.dossierUploadId, () => {
                        this.load();
                    }),
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

    async sendMail(dossier: Dossier) {
        if (!this.hasRoleAdmin) {
            return;
        }
        const upload = await firstValueFrom(this.fileService.findById(dossier.dossierUploadId));
        const context: Map<string, MailContextType> = new Map();
        context.set('Name', dossier.name);
        const ngbModalRef = this.modalService.open(MailFormComponent, {
            size: 'lg',
        });
        ngbModalRef.componentInstance.context = context;

        ngbModalRef.componentInstance.attachments = [upload];
        ngbModalRef.componentInstance.sendMail.subscribe(async (mailRequest: MailRequest) => {
            ngbModalRef.close();
            await firstValueFrom(this.mailService.send(mailRequest));
            this.toastService.showSuccess('Mail will be send');
        });
    }

    deleteDossier() {
        if (!this.hasRoleAdmin) {
            return;
        }
        this.dossierService.deleteActiveDossier().subscribe((_d) => {
            this.load();
        });
    }

    modify(d: Dossier) {
        if (!this.hasRoleAdmin) {
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            if (this.windowRefService.nativeWindow.confirm('Are you sure you want to modify the dossier?')) {
                this.openDossier(d, true);
            }
        }
    }
}
