import { Component, HostListener, OnInit } from '@angular/core';
import { MailJob } from '@core/models/mail';
import { Page } from '@core/models/page';
import { MailService } from '@core/service/mail.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MailDetailComponent } from '../mail-detail/mail-detail.component';

@Component({
  selector: 'app-mail-page',
  templateUrl: './mail-page.component.html',
  styleUrl: './mail-page.component.scss',
})
export class MailPageComponent implements OnInit {
  pageSize: number = 5;
  mails: Page<MailJob>;
  fullScreen: boolean;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(_event: KeyboardEvent) {
    if (!this.modalService.hasOpenModals()) {
      this.fullScreen = false;
    }
  }
  constructor(
    private mailService: MailService,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {
    this.load();
  }

  load(event: number = 1) {
    this.mailService.findAll(event, this.pageSize).subscribe((invoices) => {
      this.mails = invoices;
    });
  }
  openModal(mail: MailJob) {
    const modalRef = this.modalService.open(MailDetailComponent, {
      size: 'xl',
      scrollable: true,
      backdrop: 'static',
    });

    modalRef.componentInstance.mail = mail;
  }
}
