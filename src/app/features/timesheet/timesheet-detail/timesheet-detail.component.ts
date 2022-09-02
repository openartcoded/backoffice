import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { PeriodType, Timesheet, TimesheetPeriod, TimesheetSettings } from '@core/models/timesheet';
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

@Component({
  selector: 'app-timesheet-detail',
  templateUrl: './timesheet-detail.component.html',
  styleUrls: ['./timesheet-detail.component.scss'],
})
export class TimesheetDetailComponent implements OnInit, OnApplicationEvent {
  timesheet: Timesheet;
  timesheetSettings: TimesheetSettings;
  id: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private modalService: NgbModal,
    private notificationService: NotificationService,
    private fileService: FileService,
    private timesheetService: TimesheetService
  ) {}

  async ngOnInit() {
    this.id = this.route.snapshot.params.id;
    await this.load();
    this.notificationService.subscribe(this);
  }

  isWeekend(period: TimesheetPeriod) {
    return PeriodType[PeriodType.WEEKEND] === period.periodType.toString();
  }

  openPeriod(period: TimesheetPeriod) {
    const ref = this.modalService.open(PeriodFormComponent, { size: 'lg' });
    ref.componentInstance.period = period;
    ref.componentInstance.timesheetId = this.timesheet.id;
    ref.componentInstance.timesheetClosed = this.timesheet.closed;
    ref.dismissed.subscribe(async (value) => {
      await this.load();
    });
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
    await firstValueFrom(this.timesheetService.closeTimesheet(this.timesheet.id));
  }

  async reopen() {
    await firstValueFrom(this.timesheetService.reopenTimesheet(this.timesheet.id));
  }

  download() {
    this.fileService.findById(this.timesheet.uploadId).subscribe((upl) => {
      this.fileService.download(upl);
    });
  }

  openPdfViewer() {
    this.fileService.findById(this.timesheet.uploadId).subscribe((upl) => {
      const ngbModalRef = this.modalService.open(PdfViewerComponent, {
        size: 'xl',
        scrollable: true,
      });
      ngbModalRef.componentInstance.pdf = upl;
      ngbModalRef.componentInstance.title = upl.metadata?.originalFilename;
    });
  }

  private async load() {
    this.timesheetService.findById(this.id).subscribe((ts) => (this.timesheet = ts));
    this.timesheetSettings = await firstValueFrom(this.timesheetService.getSettings());
  }

  handle(events: ArtcodedNotification[]) {
    this.load().then((value) => {});
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribe(this);
  }

  shouldHandle(event: ArtcodedNotification): boolean {
    console.log(event.type);
    console.log(RegisteredEvent.REOPENED_TIMESHEET);

    return (
      !event.seen &&
      (event.type === RegisteredEvent.REOPENED_TIMESHEET || event.type === RegisteredEvent.CLOSED_TIMESHEET)
    );
  }

  delete() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this timesheet?')) {
        this.timesheetService.delete(this.timesheet.id).subscribe(d => {
          this.router.navigateByUrl('/timesheets');
        });
      }
    }

  }

  shouldMarkEventAsSeenAfterConsumed(): boolean {
    return true;
  }
}
