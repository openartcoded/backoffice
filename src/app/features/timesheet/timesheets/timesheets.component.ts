import { Component, OnInit } from '@angular/core';
import { TimesheetService } from '@core/service/timesheet.service';
import { Timesheet } from '@core/models/timesheet';
import { DateUtils } from '@core/utils/date-utils';
import { Title } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { PersonalInfoService } from '@core/service/personal.info.service';

@Component({
    selector: 'app-timesheets',
    templateUrl: './timesheets.component.html',
    styleUrls: ['./timesheets.component.scss'],
})
export class TimesheetsComponent implements OnInit {
    timesheetsGroupedByYearAndClientName: Map<number, Map<string, Timesheet[]>>;
    selectedTimesheetYear: Timesheet[];
    selectedYear: number;
    selectedClientName: string;
    estimateTotalThisMonth$: Observable<number>;
    demoMode?: boolean;

    constructor(
        private timesheetService: TimesheetService,
        private personalInfoService: PersonalInfoService,
        private titleService: Title,
    ) { }

    ngOnInit(): void {
        this.titleService.setTitle('Timesheets');
        this.estimateTotalThisMonth$ = this.timesheetService.estimateTotalToBeInvoicedThisMonth();
        this.timesheetService.findAllGroupedByYearAndClientName().subscribe((data) => {
            // TODO typescript doesn't turn it to an actual Map. you cannot use has, get, etc
            this.timesheetsGroupedByYearAndClientName = data || new Map();
            this.setTimesheetYear(this.currentYear);
        });
        this.personalInfoService.get().subscribe(p => this.demoMode = p.demoMode);
    }

    setClient(name: string) {
        this.selectedClientName = name;
        this.setTimesheetYear(this.selectedYear);
    }

    setTimesheetYear(year: number) {
        // this will probably cause issues in the future.
        const byYear = this.timesheetsGroupedByYearAndClientName[year];
        if (byYear && !this.selectedClientName) {
            this.selectedClientName = Object.keys(byYear)?.find((f) => true);
        }
        if (this.selectedClientName && byYear) {
            this.selectedTimesheetYear = byYear[this.selectedClientName]?.sort((a, b) => b.month - a.month);
        }

        this.selectedYear = year;
    }

    get statsSelectedYear() {
        if (this.selectedTimesheetYear?.length) {
            const sumWorkingDays = this.selectedTimesheetYear.map((t) => t.numberOfWorkingDays).reduce((a1, a2) => a1 + a2);
            const sumWorkingMinutes = this.selectedTimesheetYear
                .map((t) => t.numberOfMinutesWorked)
                .reduce((a1, a2) => a1 + a2);

            const calcHourMin = (sumWorkingMinutes: number) => {
                const workingHours = Math.floor(sumWorkingMinutes / 60);
                const remainWorkingMin = sumWorkingMinutes % 60;
                return { workingHours, remainWorkingMin };
            };
            let { workingHours, remainWorkingMin } = calcHourMin(sumWorkingMinutes);

            const sumWorkingHours = `${workingHours.toString().padStart(2, '0')}:${remainWorkingMin
                .toString()
                .padStart(2, '0')}`;

            let avgWorkingDays = Math.round(sumWorkingDays / this.selectedTimesheetYear.length);
            let avgMinutes = Math.round(sumWorkingMinutes / this.selectedTimesheetYear.length);

            let { workingHours: avgWh, remainWorkingMin: avgRemainWm } = calcHourMin(avgMinutes);
            const avgWorkingHours = `${avgWh.toString().padStart(2, '0')}:${avgRemainWm.toString().padStart(2, '0')}`;
            return { sumWorkingDays, avgWorkingDays, avgWorkingHours, sumWorkingHours };
        }
        return null;
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
