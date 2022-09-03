import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '@core/service/timesheet.service';
import { Timesheet } from '@core/models/timesheet';
import { DateUtils } from '@core/utils/date-utils';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-timesheets',
  templateUrl: './timesheets.component.html',
  styleUrls: ['./timesheets.component.scss'],
})
export class TimesheetsComponent implements OnInit {
  timesheetsGroupedByYearAndClientName: Map<number, Map<String, Timesheet[]>>;
  selectedTimesheetYear: Timesheet[];
  selectedYear: number;
  selectedClientName: string;

  constructor(private timesheetService: TimesheetService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Timesheets');
    this.timesheetService.findAllGroupedByYearAndClientName().subscribe((data) => {
      this.timesheetsGroupedByYearAndClientName = data;
      this.setTimesheetYear(this.currentYear);
    });
  }

  setTimesheetYear(year: number) {
    const byYear = this.timesheetsGroupedByYearAndClientName[year];
    if (byYear && !this.selectedClientName) {
      this.selectedClientName = Object.keys(byYear)?.find((f) => true);
    }
    if (this.selectedClientName && byYear) {
      this.selectedTimesheetYear = byYear[this.selectedClientName]?.sort((a, b) => a.month - b.month);
    }
    this.selectedYear = year;
  }

  get currentYear() {
    return DateUtils.getCurrentYear();
  }

  get years(): number[] {
    return Object.keys(this.timesheetsGroupedByYearAndClientName)
      .map((k) => parseInt(k))
      .sort((a, b) => (a > b ? 1 : -1));
  }

  get clientNames() {
    const names: string[] = [];
    for (const tsPerYear of Object.values(this.timesheetsGroupedByYearAndClientName)) {
      for (const name of Object.keys(tsPerYear)) {
        if (!names.includes(name)) {
          names.push(name);
        }
      }
    }
    return names;
  }
}
