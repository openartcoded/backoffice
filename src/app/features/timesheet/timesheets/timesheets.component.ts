import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '@core/service/timesheet.service';
import { Timesheet } from '@core/models/timesheet';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TimesheetSettingsComponent } from '@feature/timesheet/timesheet-settings/timesheet-settings.component';
import { DateUtils } from '@core/utils/date-utils';
import { Title } from '@angular/platform-browser';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
})
export class TimesheetsComponent implements OnInit {
  timesheetsGroupedByYear: Map<number, Timesheet[]>;
  selectedTimesheetYear: Timesheet[];
  selectedYear: number;

  constructor(
    private timesheetService: TimesheetService,
    private titleService: Title,

    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Timesheets');
    this.timesheetService.findAllGroupedByYear().subscribe((data) => {
      this.timesheetsGroupedByYear = data;
      this.setTimesheetYear(this.currentYear);
    });
  }

  setTimesheetYear(year: number) {
    this.selectedTimesheetYear = this.timesheetsGroupedByYear[year]?.sort((a, b) => a.month - b.month);
    this.selectedYear = year;
  }

  get currentYear() {
    return DateUtils.getCurrentYear();
  }

  get years(): number[] {
    return Object.keys(this.timesheetsGroupedByYear)
      .map((k) => parseInt(k))
      .sort((a, b) => (a > b ? 1 : -1));
  }

  async openSettings() {
    const settings = await firstValueFrom(this.timesheetService.getSettings());
    const ref = this.modalService.open(TimesheetSettingsComponent, {
      size: 'lg',
    });
    ref.componentInstance.settings = settings;
    ref.componentInstance.onSubmitForm.subscribe(async (updated) => {
      await firstValueFrom(this.timesheetService.updateSettings(updated));
      ref.close();
    });
  }
}
