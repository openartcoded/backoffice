import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { DateBetweenValidator } from '@core/validators/date-between.validator';
import moment from 'moment';
import { formatDate } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { DateUtils } from '@core/utils/date-utils';

@Component({
    selector: 'app-date-between',
    templateUrl: './date-between.component.html',
    styleUrls: ['./date-between.component.scss'],
    standalone: false
})
export class DateBetweenComponent implements OnInit {
    dateBetweenForm: UntypedFormGroup;
    result: number;
    resultStmt: string;
    typeOptions: string[] = ['days', 'months', 'years'];

    constructor(private fb: UntypedFormBuilder, private titleService: Title, private metaService: Meta) { }

    ngOnInit(): void {
        this.titleService.setTitle('Date between');
        this.metaService.updateTag({
            name: 'description',
            content: `How many days between two dates?`,
        });
        this.dateBetweenForm = this.fb.group(
            {
                sinceType: new UntypedFormControl('days', [Validators.required]),
                startDate: new UntypedFormControl(DateUtils.formatInputDate(DateUtils.now()), [Validators.required]),
                endDate: new UntypedFormControl(DateUtils.formatInputDate(DateUtils.now()), [Validators.required]),
            },
            {
                validators: DateBetweenValidator('startDate', 'endDate'),
            }
        );
    }

    get sinceType(): string {
        return this.dateBetweenForm.get('sinceType').value;
    }

    get startDate(): string {
        return this.dateBetweenForm.get('startDate').value;
    }

    get endDate(): string {
        return this.dateBetweenForm.get('endDate').value;
    }

    submit() {
        let start = moment(this.startDate, 'YYYY-MM-DD');
        let end = moment(this.endDate, 'YYYY-MM-DD');

        let duration = moment.duration(end.diff(start));
        switch (this.sinceType) {
            case 'days':
                this.result = duration.asDays();
                break;
            case 'months':
                this.result = duration.asMonths();
                break;
            case 'years':
                this.result = duration.asYears();
                break;
        }
        let formattedStart = formatDate(this.startDate, 'dd/MM/yyyy', 'de');
        let formattedEnd = formatDate(this.endDate, 'dd/MM/yyyy', 'de');

        this.resultStmt = `${this.sinceType} between ${formattedStart} and ${formattedEnd}`;
    }

    floor(result: number): number {
        return Math.floor(result);
    }
}
