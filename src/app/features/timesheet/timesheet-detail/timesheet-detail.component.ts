import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import {
  PeriodType,
  Timesheet,
  TimesheetPeriod,
  TimesheetSettings,
  TimesheetSettingsForm,
} from '@core/models/timesheet';
import { ActivatedRoute, Router } from '@angular/router';
import { TimesheetService } from '@core/service/timesheet.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PeriodFormComponent } from '@feature/timesheet/period-form/period-form.component';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { FileService } from '@core/service/file.service';
import { OnApplicationEvent, RegisteredEvent } from '@core/interface/on-application-event';
import { NotificationService } from '@core/service/notification.service';
import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { firstValueFrom } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';
import { TimesheetSettingsComponent } from '../timesheet-settings/timesheet-settings.component';
import { BillableClientService } from '@core/service/billable-client.service';
import { ToastService } from '@core/service/toast.service';
import { ContractStatus } from '@core/models/billable-client';
import { MailFormComponent } from '@shared/mail-form/mail-form.component';
import { MailContextType, MailRequest } from '@core/models/mail';
import { MailService } from '@core/service/mail.service';
import { InvoiceDetailComponent } from '@feature/invoice/invoice-detail/invoice-detail.component';
import { InvoiceService } from '@core/service/invoice.service';
import { PersonalInfoService } from '@core/service/personal.info.service';
@Component({
  selector: 'app-timesheet-detail',
  templateUrl: './timesheet-detail.component.html',
  styleUrls: ['./timesheet-detail.component.scss'],
  standalone: false,
})
export class TimesheetDetailComponent implements OnInit, OnApplicationEvent {
  timesheet: Timesheet;
  timesheetSettings: TimesheetSettings;
  id: string;
  demoMode: boolean;

  currentFilter = PeriodType[PeriodType.WORKING_DAY];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private modalService: NgbModal,
    private invoiceService: InvoiceService,
    private billableClientService: BillableClientService,
    private notificationService: NotificationService,
    private fileService: FileService,
    private timesheetService: TimesheetService,
    private mailService: MailService,
    private toastService: ToastService,
    private personalInfoService: PersonalInfoService,
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params.id;
    this.load();
    this.notificationService.subscribe(this);
    this.personalInfoService.get().subscribe((p) => (this.demoMode = p.demoMode));
  }

  isWeekend(period: TimesheetPeriod) {
    return PeriodType[PeriodType.WEEKEND] === period.periodType.toString();
  }

  isToday(period: TimesheetPeriod) {
    return this.isWorkday(period) && new Date().toDateString() === new Date(period.date).toDateString();
  }

  isNotWorkday(period: TimesheetPeriod) {
    return !this.isWorkday(period);
  }

  isWorkday(period: TimesheetPeriod) {
    return PeriodType[PeriodType.WORKING_DAY] === period.periodType?.toString();
  }
  openPeriod(period: TimesheetPeriod) {
    const ref = this.modalService.open(PeriodFormComponent, { size: 'lg', keyboard: false, backdrop: 'static' });
    ref.componentInstance.period = period;
    ref.componentInstance.student = this.timesheet.student;
    ref.componentInstance.timesheetId = this.timesheet.id;
    ref.componentInstance.settings = this.timesheetSettings;
    ref.componentInstance.timesheetClosed = this.timesheet.closed;
    ref.dismissed.subscribe((_value) => {
      this.load();
    });
  }

  async openInvoice() {
    const clients = await firstValueFrom(this.billableClientService.findAll());
    const templates = await firstValueFrom(this.invoiceService.listTemplates());
    const invoice = await firstValueFrom(this.invoiceService.findById(this.timesheet.invoiceId));
    const ref = this.modalService.open(InvoiceDetailComponent, { size: 'xl' });
    ref.componentInstance.clients = clients;
    ref.componentInstance.invoice = invoice;
    ref.componentInstance.templates = templates;
  }

  getTagForPeriodType(pt: PeriodType) {
    return this.tags.find((t) => t.periodType === pt.toString());
  }

  validityColorDuration(period: TimesheetPeriod) {
    if (period.periodType.toString() !== PeriodType[PeriodType.WORKING_DAY]) {
      return 'text-dark';
    }
    let durationInHours = period.duration / 60.0;
    if (durationInHours > this.timesheetSettings.maxHoursPerDay) {
      return 'text-danger';
    }
    if (durationInHours < this.timesheetSettings.minHoursPerDay) {
      return 'text-warning';
    }
    return 'text-success';
  }

  get tags() {
    return [
      {
        label: 'working day',
        periodType: PeriodType[PeriodType.WORKING_DAY],
        color: 'text-success',
      },
      {
        label: 'weekend',
        periodType: PeriodType[PeriodType.WEEKEND],
        color: 'text-warning',
      },
      {
        label: 'sick day',
        periodType: PeriodType[PeriodType.SICKNESS],
        color: 'text-danger',
      },
      {
        label: 'public holidays',
        periodType: PeriodType[PeriodType.PUBLIC_HOLIDAYS],
        color: 'text-info',
      },
      {
        label: 'authorized holidays',
        periodType: PeriodType[PeriodType.AUTHORIZED_HOLIDAYS],
        color: 'text-primary',
      },
    ];
  }

  getDuration(duration: number) {
    return Math.floor(duration / 60) + ':' + ('0' + (duration % 60)).slice(-2);
  }

  async release() {
    this.toastService.showSuccess('timesheet will be generated');
    await firstValueFrom(this.timesheetService.closeTimesheet(this.timesheet.id));
  }

  async reopen() {
    this.toastService.showSuccess('timesheet will be reopened');
    await firstValueFrom(this.timesheetService.reopenTimesheet(this.timesheet.id));
  }
  async generateInvoice() {
    this.toastService.showSuccess('invoice will be generated');
    const timesheet = await firstValueFrom(this.timesheetService.generateInvoice(this.timesheet.id));
    this.timesheet = timesheet;
  }

  download() {
    this.fileService.findById(this.timesheet.uploadId).subscribe((upl) => {
      this.fileService.download(upl);
    });
  }

  async send() {
    const upload = await firstValueFrom(this.fileService.findById(this.timesheet.uploadId));
    const clients = await firstValueFrom(this.billableClientService.findAll());

    const ctx: Map<string, MailContextType> = new Map();
    ctx.set('Client', this.timesheet.clientName);
    ctx.set('Period', this.timesheet.month + '/' + this.timesheet.year);
    const ngbModalRef = this.modalService.open(MailFormComponent, {
      size: 'lg',
    });
    ngbModalRef.componentInstance.attachments = [upload];
    ngbModalRef.componentInstance.context = ctx;
    ngbModalRef.componentInstance.defaultSubject = 'Timesheet ' + ctx.get('Period');
    ngbModalRef.componentInstance.to = clients
      .filter((c) => c.id == this.timesheet.clientId)
      .map((c) => c.emailAddress);
    ngbModalRef.componentInstance.sendMail.subscribe(async (mailRequest: MailRequest) => {
      ngbModalRef.close();
      await firstValueFrom(this.mailService.send(mailRequest));
      this.toastService.showSuccess('Mail will be send');
    });
  }
  get periods() {
    if (this.currentFilter) {
      return this.timesheet?.periods?.filter((p) => this.currentFilter.toString() === p.periodType.toString());
    }
    return this.timesheet?.periods;
  }

  setFilter(tag?: any) {
    this.currentFilter = tag?.periodType;
  }

  openPdfViewer() {
    this.fileService.findById(this.timesheet.uploadId).subscribe((upl) => {
      const ngbModalRef = this.modalService.open(PdfViewerComponent, {
        size: 'xl',
        scrollable: true,
      });
      ngbModalRef.componentInstance.pdf = upl;
      ngbModalRef.componentInstance.title = upl?.originalFilename;
    });
  }

  load() {
    this.timesheetService.findById(this.id).subscribe((ts) => {
      this.timesheet = ts;
      this.timesheetSettings = this.timesheet.settings;
    });
  }

  handle(_events: ArtcodedNotification[]) {
    this.load();
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribe(this);
  }

  shouldHandle(event: ArtcodedNotification): boolean {
    return (
      !event.seen &&
      (event.type === RegisteredEvent.REOPENED_TIMESHEET || event.type === RegisteredEvent.CLOSED_TIMESHEET)
    );
  }

  delete() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this timesheet?')) {
        this.timesheetService.delete(this.timesheet.id).subscribe((d) => {
          this.router.navigateByUrl('/timesheets');
        });
      }
    }
  }
  async openSettings() {
    const clients = await firstValueFrom(this.billableClientService.findByContractStatus(ContractStatus.ONGOING));
    const settings = {
      clientId: this.timesheet.clientId,
      timesheetId: this.timesheet.id,
      maxHoursPerDay: this.timesheet?.settings?.maxHoursPerDay,
      minHoursPerDay: this.timesheet?.settings?.minHoursPerDay,
    } as TimesheetSettingsForm;
    const ref = this.modalService.open(TimesheetSettingsComponent, {
      size: 'lg',
    });
    ref.componentInstance.settings = settings;
    ref.componentInstance.clients = clients;
    ref.componentInstance.onSubmitForm.subscribe(async (updated) => {
      ref.close();
      await firstValueFrom(this.timesheetService.updateSettings(updated));
      this.toastService.showSuccess('Settings updated');
      this.load();
    });
  }

  shouldMarkEventAsSeenAfterConsumed(): boolean {
    return true;
  }
}
