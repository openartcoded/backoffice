import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '@core/models/page';
import { FileUpload } from '@core/models/file-upload';
import { FileService } from '@core/service/file.service';
import { WindowRefService } from '@core/service/window.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { AdministrativeDocument, AdministrativeDocumentSearchCriteria } from '@core/models/administrative-document';
import { AdministrativeDocumentService } from '@core/service/administrative-document.service';
import { tap } from 'rxjs/operators';
import { DocumentEditorComponent } from '@feature/administrative-document/document-editor/document-editor.component';
import { OnApplicationEvent, RegisteredEvent } from '@core/interface/on-application-event';
import { NotificationService } from '@core/service/notification.service';
import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { OnDestroy } from '@angular/core';
import { SplitPdfComponent } from '../split-pdf/split-pdf.component';
import { MailContextType, MailRequest } from '@core/models/mail';
import { MailFormComponent } from '@shared/mail-form/mail-form.component';
import { ToastService } from '@core/service/toast.service';
import { MailService } from '@core/service/mail.service';
import { firstValueFrom } from 'rxjs';
import { DossierService } from '@core/service/dossier.service';
import { Dossier } from '@core/models/dossier';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';

@Component({
    selector: 'app-document-result',
    templateUrl: './document-result.component.html',
    styleUrls: ['./document-result.component.scss'],
    standalone: false
})
export class DocumentResultComponent implements OnInit, OnDestroy, OnApplicationEvent {
    adminDocuments: Page<AdministrativeDocument>;
    pageSize: number = 10;
    searchCriteria: AdministrativeDocumentSearchCriteria;
    activeDossier: Dossier;
    user: User;
    demoMode: boolean;
    get hasRoleAdmin(): boolean {
        return this.user.authorities.includes('ADMIN');
    }
    constructor(
        private fileService: FileService,
        private administrativeDocumentService: AdministrativeDocumentService,
        @Inject(PLATFORM_ID) private platformId: any,
        private windowRefService: WindowRefService,
        private notificationService: NotificationService,
        private modalService: NgbModal,
        private personalInfoService: PersonalInfoService,

        private toastService: ToastService,
        private mailService: MailService,
        private dossierService: DossierService,
        private titleService: Title,
    ) { }

    ngOnInit() {
        this.titleService.setTitle('Administrative Documents');
        this.notificationService.subscribe(this);
        this.dossierService.activeDossier().subscribe((dt) => (this.activeDossier = dt));
        this.personalInfoService.me().subscribe((u) => (this.user = u));
        this.personalInfoService.get().subscribe((u) => (this.demoMode = u.demoMode));

        this.search({});
    }

    search(criteria: AdministrativeDocumentSearchCriteria) {
        this.searchCriteria = criteria;
        this.load();
    }

    download(upl: FileUpload) {
        this.fileService.download(upl);
    }

    delete(ad: AdministrativeDocument) {
        if (!this.hasRoleAdmin) {
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this document? ')) {
                this.administrativeDocumentService.delete(ad).subscribe((d) => {
                    this.search(this.searchCriteria);
                });
            }
        }
    }

    get pageNumber() {
        return this?.adminDocuments?.page?.number + 1;
    }

    load(event: number = 1) {
        this.administrativeDocumentService
            .search(this.searchCriteria, event, this.pageSize)
            .pipe(
                tap((page) => {
                    const attachmentIds = page.content?.map((d) => d.attachmentId);
                    this.fileService.findByIds(attachmentIds).subscribe((attachments) => {
                        attachments.forEach((attachment) => {
                            page.content.filter((d) => d.attachmentId === attachment.id).forEach((d) => (d.attachment = attachment));
                        });
                    });
                }),
            )
            .subscribe((data) => (this.adminDocuments = data));
    }

    openRow(a: AdministrativeDocument) {
        if (this.isPdf(a.attachment)) {
            this.openPdfViewer(a.attachment);
        } else if (this.isImage(a.attachment)) {
            this.openImageViewer(a.attachment);
        } else {
            this.addOrEdit(a);
        }
    }
    openPdfViewer(a: FileUpload) {
        let ngbModalRef = this.modalService.open(PdfViewerComponent, {
            size: 'xl',
            scrollable: true,
        });
        ngbModalRef.componentInstance.pdf = a;
        ngbModalRef.componentInstance.demoMode = this.demoMode;
        ngbModalRef.componentInstance.title = a?.originalFilename;
    }

    openImageViewer(a: FileUpload) {
        let ngbModalRef = this.modalService.open(ImageViewerComponent, {
            size: 'xl',
            scrollable: true,
        });
        ngbModalRef.componentInstance.image = a;
        ngbModalRef.componentInstance.title = a?.originalFilename;
    }

    isPdf(upl: FileUpload) {
        return FileService.isPdf(upl?.contentType);
    }

    isImage(upl: FileUpload) {
        return FileService.isImage(upl?.contentType);
    }

    addOrEdit(ad: AdministrativeDocument = { title: '' }) {
        let ref = this.modalService.open(DocumentEditorComponent, { size: 'xl', backdrop: 'static' });
        ref.componentInstance.adminDoc = ad;
        ref.componentInstance.user = this.user;
        ref.componentInstance.formSubmitted.subscribe((form) => {
            ref.close();
            this.administrativeDocumentService.save(form).subscribe();
        });
    }

    handle(events: ArtcodedNotification[]) {
        this.load();
    }

    ngOnDestroy(): void {
        this.notificationService.unsubscribe(this);
    }

    shouldHandle(event: ArtcodedNotification): boolean {
        return (
            !event.seen &&
            (event.type === RegisteredEvent.ADMINISTRATIVE_DOCUMENT_ADDED ||
                event.type === RegisteredEvent.ADMINISTRATIVE_DOCUMENT_DELETED)
        );
    }

    shouldMarkEventAsSeenAfterConsumed(): boolean {
        return true;
    }

    split() {
        this.modalService.open(SplitPdfComponent, {
            size: 'sm',
        });
    }
    async sendMail(document: AdministrativeDocument) {
        if (!this.hasRoleAdmin) {
            return;
        }
        const context: Map<string, MailContextType> = new Map();
        const ngbModalRef = this.modalService.open(MailFormComponent, {
            size: 'lg',
        });
        ngbModalRef.componentInstance.context = context;

        ngbModalRef.componentInstance.attachments = [document.attachment];
        ngbModalRef.componentInstance.sendMail.subscribe(async (mailRequest: MailRequest) => {
            ngbModalRef.close();
            await firstValueFrom(this.mailService.send(mailRequest));
            this.toastService.showSuccess('Mail will be send');
        });
    }

    addToDossier(document: AdministrativeDocument) {
        if (!this.hasRoleAdmin) {
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            if (this.windowRefService.nativeWindow.confirm('Add document to dossier?')) {
                this.dossierService.addDocumentToDossier(document.id).subscribe((dt) => {
                    this.load();
                });
            }
        }
    }
}
