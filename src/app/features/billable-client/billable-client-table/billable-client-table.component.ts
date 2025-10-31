import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { OnApplicationEvent, RegisteredEvent } from '@core/interface/on-application-event';
import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { BillableClient, ContractStatus } from '@core/models/billable-client';
import { RateType } from '@core/models/common';
import { BillableClientService } from '@core/service/billable-client.service';
import { FileService } from '@core/service/file.service';
import { NotificationService } from '@core/service/notification.service';
import { ToastService } from '@core/service/toast.service';
import { WindowRefService } from '@core/service/window.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';
import { BillableClientDetailComponent } from '../billable-client-detail/billable-client-detail.component';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';

@Component({
    selector: 'app-billable-client-table',
    templateUrl: './billable-client-table.component.html',
    styleUrls: ['./billable-client-table.component.scss'],
    standalone: false,
})
export class BillableClientTableComponent implements OnInit, OnApplicationEvent {
    currentNgbModalRef: NgbModalRef;
    user: User;
    demoMode: boolean;
    get hasRoleAdmin(): boolean {
        return this.user.authorities.includes('ADMIN');
    }

    clients: BillableClient[];
    constructor(
        private billableClientService: BillableClientService,
        private titleService: Title,
        private toastService: ToastService,
        private fileService: FileService,
        private notificationService: NotificationService,
        private metaService: Meta,
        private personalInfoService: PersonalInfoService,

        @Inject(PLATFORM_ID) private platformId: any,
        private windowRefService: WindowRefService,
        private modalService: NgbModal,
    ) { }

    ngOnInit(): void {
        this.titleService.setTitle('Clients');
        this.personalInfoService.me().subscribe((u) => (this.user = u));
        this.personalInfoService.get().subscribe((u) => (this.demoMode = u.demoMode));
        this.metaService.updateTag({
            name: 'description',
            content: 'Manage Clients',
        });
        this.notificationService.subscribe(this);
        this.load();
    }

    load() {
        this.billableClientService.findAll().subscribe((clients) => (this.clients = clients));
    }

    async addOrEdit(client?: BillableClient) {
        this.currentNgbModalRef = this.modalService.open(BillableClientDetailComponent, {
            size: 'xl',
            scrollable: true,
            backdrop: 'static',
            keyboard: false,
        });
        this.currentNgbModalRef.componentInstance.user = this.user;
        this.currentNgbModalRef.componentInstance.demoMode = this.demoMode;
        let clientToUpdate =
            client ||
            ({
                defaultWorkingDays: [],
                address: '',
                city: '',
                contractStatus: ContractStatus.NOT_STARTED_YET,
                documentIds: [],
                emailAddress: '',
                endDate: null,
                startDate: new Date(),
                name: '',
                rateType: RateType.DAYS,
            } as BillableClient);
        this.currentNgbModalRef.componentInstance.client = clientToUpdate;
        clientToUpdate.documents = (await firstValueFrom(this.fileService.findByCorrelationId(clientToUpdate.id))).sort(
            (a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(),
        );

        this.currentNgbModalRef.componentInstance.onUpload.subscribe(async (req: { file: File; id: string }) => {
            await firstValueFrom(this.billableClientService.upload(req.id, req.file));
            this.toastService.showSuccess('Will add a new document to the client in a bit');
        });
        this.currentNgbModalRef.componentInstance.onDeleteUpload.subscribe(
            async (req: { uploadId: string; id: string }) => {
                await firstValueFrom(this.billableClientService.deleteUpload(req.id, req.uploadId));
                this.toastService.showSuccess('Will delete the document in a bit');
            },
        );
        this.currentNgbModalRef.componentInstance.onSaveClient.subscribe(async (client: BillableClient) => {
            this.currentNgbModalRef.close();
            this.billableClientService.save(client).subscribe((client: BillableClient) => {
                this.toastService.showSuccess('Client updated');
                this.load();
            });
        });
        this.currentNgbModalRef.closed.subscribe(() => {
            this.currentNgbModalRef = null;
        });
    }

    delete(client: BillableClient) {
        if (!this.hasRoleAdmin) {
            return;
        }
        if (isPlatformBrowser(this.platformId)) {
            if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this client?')) {
                this.billableClientService.delete(client.id).subscribe((_data) => {
                    this.load();
                    this.toastService.showSuccess('Client deleted');
                });
            }
        }
    }
    getContractStatus(status: unknown) {
        switch (status) {
            case ContractStatus[ContractStatus.DONE]:
                return 'Ended';
            case ContractStatus[ContractStatus.ONGOING]:
                return 'In Progress';
            case ContractStatus[ContractStatus.NOT_STARTED_YET]:
                return 'Not started';
            default:
                throw Error('status unknown ' + status);
        }
    }
    getContractStatusClasses(status: unknown) {
        switch (status) {
            case ContractStatus[ContractStatus.DONE]:
                return ['text-danger'];
            case ContractStatus[ContractStatus.ONGOING]:
                return ['text-success'];
            case ContractStatus[ContractStatus.NOT_STARTED_YET]:
                return ['text-primary'];
            default:
                throw Error('status unknown ' + status);
        }
    }

    handle(events: ArtcodedNotification[]) {
        const filteredEvents = events.filter(
            (event) =>
                event.type === RegisteredEvent.BILLABLE_CLIENT_UPLOAD_ADDED ||
                event.type === RegisteredEvent.BILLABLE_CLIENT_UPLOAD_DELETED,
        );

        if (filteredEvents && this.currentNgbModalRef) {
            const client = this.currentNgbModalRef.componentInstance.client;
            this.fileService.findByCorrelationId(client.id).subscribe((documents) => {
                client.documents = documents.sort(
                    (a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime(),
                );
                this.currentNgbModalRef.componentInstance.client = client;
            });
        }
    }

    ngOnDestroy(): void {
        this.notificationService.unsubscribe(this);
    }

    shouldHandle(event: ArtcodedNotification): boolean {
        return (
            !event.seen &&
            (event.type === RegisteredEvent.BILLABLE_CLIENT_UPLOAD_ADDED ||
                event.type === RegisteredEvent.BILLABLE_CLIENT_UPLOAD_DELETED ||
                event.type === RegisteredEvent.BILLABLE_CLIENT_ERROR)
        );
    }

    shouldMarkEventAsSeenAfterConsumed(): boolean {
        return true;
    }
}
