import { Component, HostListener, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MailJob } from '@core/models/mail';
import { Page } from '@core/models/page';
import { MailService } from '@core/service/mail.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MailDetailComponent } from '../mail-detail/mail-detail.component';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from '@core/service/toast.service';
import { PersonalInfoService } from '@core/service/personal.info.service';

@Component({
    selector: 'app-mail-page',
    templateUrl: './mail-page.component.html',
    styleUrl: './mail-page.component.scss',
    standalone: false
})
export class MailPageComponent implements OnInit {
    pageSize: number = 5;
    mails: Page<MailJob>;
    fullScreen: boolean;

    demoMode: boolean;
    @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(_event: KeyboardEvent) {
        if (!this.modalService.hasOpenModals()) {
            this.fullScreen = false;
        }
    }
    constructor(
        private mailService: MailService,
        private modalService: NgbModal,
        private personalInfoService: PersonalInfoService,
        private toastService: ToastService,
        private windowService: WindowRefService,
        @Inject(PLATFORM_ID) private platformId: any,
    ) { }
    ngOnInit(): void {
        this.load();
    }

    load(event: number = 1) {
        this.mailService.findAll(event, this.pageSize).subscribe((invoices) => {
            this.mails = invoices;
        });
        this.personalInfoService.get().subscribe((p) => this.demoMode = p.demoMode);
    }
    openModal(mail: MailJob) {
        const modalRef = this.modalService.open(MailDetailComponent, {
            size: 'xl',
            scrollable: true,
            backdrop: 'static',
        });

        modalRef.componentInstance.demoMode = this.demoMode;
        modalRef.componentInstance.update.subscribe((m: MailJob) => {
            this.mailService.update(m).subscribe(() => {
                modalRef.close();
                this.toastService.showSuccess('Mail job updated');

                this.load();
            });
        });

        modalRef.componentInstance.mail = mail;
    }
    delete($event: any, m: MailJob) {
        $event.preventDefault();
        if (isPlatformBrowser(this.platformId)) {
            let resp = this.windowService.nativeWindow.confirm('Are you sure you want to delete this row? ');
            if (resp) {
                this.mailService.delete(m.id).subscribe(() => this.load());
            }
        }
    }
}
