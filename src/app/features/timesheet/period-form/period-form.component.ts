import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { PeriodType, TimesheetPeriod, TimesheetSettings } from '@core/models/timesheet';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TimesheetService } from '@core/service/timesheet.service';
import { formatDate } from '@angular/common';
import moment from 'moment-timezone';

@Component({
    selector: 'app-period-form',
    templateUrl: './period-form.component.html',
    styleUrls: ['./period-form.component.scss'],
    standalone: false,
})
export class PeriodFormComponent implements OnInit {
    periodTypeClass = PeriodType;

    @Input()
    extraBtnClasses: string = '';
    @Input()
    componentType: 'btn' | 'modal' = 'modal';

    @Input()
    settings: TimesheetSettings;

    @Output()
    onSubmitForm: EventEmitter<TimesheetPeriod> = new EventEmitter<TimesheetPeriod>();

    @Input()
    period: TimesheetPeriod;
    @Input()
    timesheetId: string;
    @Input()
    timesheetClosed: boolean;
    @Input()
    student: boolean;

    form: UntypedFormGroup;

    constructor(
        @Optional() public activeModal: NgbActiveModal,
        private timesheetService: TimesheetService,
        private fb: UntypedFormBuilder,
    ) { }

    ngOnInit(): void {
        this.loadForm();
    }

    convertDateForm(timestamp) {
        return !timestamp ? null : formatDate(timestamp, 'HH:mm', 'de');
    }

    loadForm() {
        this.form = this.fb.group({
            periodType: new UntypedFormControl(
                {
                    value: this.period.periodType,
                    disabled: this.timesheetClosed,
                },
                [Validators.required],
            ),
            morningStartTime: new UntypedFormControl(
                {
                    value: this.convertDateForm(this.period.morningStartTime),
                    disabled: this.timesheetClosed,
                },
                [Validators.required],
            ),
            morningEndTime: new UntypedFormControl(
                {
                    value: this.convertDateForm(this.period.morningEndTime),
                    disabled: !this.period.morningStartTime || this.timesheetClosed,
                },
                this.period.morningStartTime ? [Validators.required] : [],
            ),
            afternoonStartTime: new UntypedFormControl(
                {
                    value: this.convertDateForm(this.period.afternoonStartTime),
                    disabled: !this.period.morningEndTime || this.timesheetClosed,
                },
                this.period.morningEndTime ? [Validators.required] : [],
            ),
            afternoonEndTime: new UntypedFormControl(
                {
                    value: this.convertDateForm(this.period.afternoonEndTime),
                    disabled: !this.period.afternoonStartTime || this.timesheetClosed,
                },
                this.period.afternoonStartTime ? [Validators.required] : [],
            ),
            shortDescription: new UntypedFormControl(
                { value: this.period.shortDescription, disabled: this.timesheetClosed },
                [],
            ),
            projectName: new UntypedFormControl({ value: this.period.projectName, disabled: this.timesheetClosed }, []),
        });
    }

    get periodTypes() {
        return Object.keys(PeriodType)
            .filter((e) => isNaN(+e))
            .map((pt) => PeriodType[pt]);
    }

    send() {
        const date = formatDate(this.period.date, 'YYYY-MM-dd', 'de');
        const transformHours = (hour) =>
            hour
                ? moment(date + ' ' + hour, 'YYYY-MM-dd HH:mm')
                    .tz('Europe/Brussels')
                    .toDate()
                : null;
        const enableForm = (hour, control) => {
            if (hour) {
                control.enable();
            }
        };
        this.period.morningStartTime = transformHours(this.form.controls.morningStartTime.value);
        this.period.morningEndTime = transformHours(this.form.controls.morningEndTime.value);
        this.period.afternoonStartTime = transformHours(this.form.controls.afternoonStartTime.value);
        this.period.afternoonEndTime = transformHours(this.form.controls.afternoonEndTime.value);
        this.period.periodType = this.form.controls.periodType.value;
        this.period.projectName = this.form.controls.projectName.value;
        this.period.shortDescription = this.form.controls.shortDescription.value;
        this.timesheetService.saveOrUpdatePeriod(this.timesheetId, this.period).subscribe((p) => {
            this.period = p;
            this.form.controls.morningStartTime.patchValue(this.convertDateForm(p.morningStartTime));
            this.form.controls.morningEndTime.patchValue(this.convertDateForm(p.morningEndTime));
            this.form.controls.afternoonStartTime.patchValue(this.convertDateForm(p.afternoonStartTime));
            this.form.controls.afternoonEndTime.patchValue(this.convertDateForm(p.afternoonEndTime));
            this.form.controls.periodType.patchValue(p.periodType);
            this.form.controls.shortDescription.patchValue(p.shortDescription);
            enableForm(p.morningStartTime, this.form.controls.morningEndTime);
            enableForm(p.morningEndTime, this.form.controls.afternoonStartTime);
            enableForm(p.afternoonStartTime, this.form.controls.afternoonEndTime);
            this.onSubmitForm.emit(this.period);
        });
    }
    checkTypeAndAutoComplete() {
        if (this.form.controls.periodType.value?.toString() !== PeriodType[PeriodType.WORKING_DAY]) {
            this.autocomplete();
        }
    }

    autocompleteAndSave($event?: any) {
        $event?.stopPropagation();
        this.autocomplete($event);
        this.send();
    }
    autocomplete($event?: any) {
        $event?.preventDefault();
        this.form.get('morningStartTime').patchValue(this.settings.maxHoursPerDay >= 8 ? '08:00' : '09:00');
        this.form.get('morningEndTime').patchValue('12:00');
        this.form.get('afternoonStartTime').patchValue('13:00');
        this.form.get('afternoonEndTime').patchValue('17:00');
    }

    setTimeNow(event: any, componentInstance: string) {
        event?.preventDefault();
        this.form.get(componentInstance).patchValue(moment().tz('Europe/Brussels').format('HH:mm'));
    }
}
