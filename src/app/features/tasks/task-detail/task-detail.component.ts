import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormControl,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { NgbActiveModal, NgbModal, NgbTypeahead, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { ActionMetadata, ActionParameter, ReminderTask, ActionParameterType } from '@core/models/reminder-task';
import { debounceTime, distinctUntilChanged, filter, firstValueFrom, map, merge, Observable, Subject } from 'rxjs';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';
import { DateUtils } from '@core/utils/date-utils';
import { CronExpressionHelpComponent } from '../cron-expression-help/cron-expression-help.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutosizeModule } from 'ngx-autosize';

@Component({
    selector: 'app-task-detail',
    templateUrl: './task-detail.component.html',
    styleUrls: ['./task-detail.component.scss'],
    standalone: true,
    imports: [CommonModule, NgbTypeaheadModule, ReactiveFormsModule, FontAwesomeModule, AutosizeModule],
})
export class TaskDetailComponent implements OnInit {

    @ViewChild('instance', { static: true }) instance: NgbTypeahead;
    focus$ = new Subject<string>();
    click$ = new Subject<string>();
    formatter = (item: any) => (item ? item.title || item.key : '');
    search = (text$: Observable<string>) => {
        const debouncedText$ = text$.pipe(debounceTime(200), distinctUntilChanged());
        const clicksWithClosedPopup$ = this.click$.pipe(filter(() => !this.instance?.isPopupOpen()));
        const inputFocus$ = this.focus$;

        return merge(debouncedText$, inputFocus$, clicksWithClosedPopup$).pipe(
            map((term) =>
                !term?.length
                    ? this.allowedActions
                    : this.allowedActions?.filter((l) => l.title.toLowerCase().includes(term.toLowerCase())).slice(0, 10),
            ),
        );
    };

    @Input()
    task: ReminderTask;

    @Input()
    demoMode: boolean;
    @Input()
    allowedActions$: Observable<ActionMetadata[]>;
    allowedActions: ActionMetadata[];

    @Output()
    onSaveTask: EventEmitter<ReminderTask> = new EventEmitter<ReminderTask>();
    @Output()
    onDeleteTask: EventEmitter<ReminderTask> = new EventEmitter<ReminderTask>();
    @Output()
    onCloneTask: EventEmitter<ReminderTask> = new EventEmitter<ReminderTask>();

    form: UntypedFormGroup;

    constructor(
        @Optional() public activeModal: NgbActiveModal,
        private windowService: WindowRefService,
        private modalService: NgbModal,
        @Inject(PLATFORM_ID) private platformId: any,
        private fb: UntypedFormBuilder,
    ) { }

    async ngOnInit() {
        this.allowedActions = await firstValueFrom(this.allowedActions$);
        const calendarDate = DateUtils.toOptionalDate(this.task?.calendarDate);
        const calendarDateFormatted = calendarDate ? DateUtils.formatInputDateTime(calendarDate) : null;

        const specificDate = DateUtils.toOptionalDate(this.task?.specificDate);
        const specificDateFormatted = specificDate ? DateUtils.formatInputDateTime(specificDate) : null;
        this.form = this.fb.group({
            hasSpecificDate: new UntypedFormControl(
                { value: !!this.task?.specificDate || !this.task?.cronExpression, disabled: false },
                [],
            ),
            hasAction: new UntypedFormControl({ value: !!this.task?.actionKey, disabled: false }, []),
            specificDate: new UntypedFormControl(
                {
                    value: specificDateFormatted,
                    disabled: false,
                },
                [],
            ),
            calendarDate: new UntypedFormControl(
                {
                    value: calendarDateFormatted,
                    disabled: false,
                },
                [],
            ),
            quickDateSelect: new UntypedFormControl({ value: null, disabled: false }, []),
            cronExpression: new UntypedFormControl({ value: this.task?.cronExpression, disabled: false }, []),
            actionKey: new UntypedFormControl({ value: this.task?.actionKey, disabled: false }, []),
            customActionName: new UntypedFormControl({ value: this.task?.customActionName, disabled: false }, []),
            action: new UntypedFormControl(
                {
                    value: this.task?.actionKey ? this.allowedActions.find((action) => action.key === this.task.actionKey) : null,
                    disabled: false,
                },
                [],
            ),
            actionParameters: this.task?.actionParameters
                ? this.fb.array(this.task?.actionParameters?.map(this.convertParameter))
                : this.fb.array([]),
            dateCreation: new UntypedFormControl({ value: this.task?.dateCreation, disabled: true }, []),
            nextDate: new UntypedFormControl(
                {
                    value: DateUtils.formatInputDateTimeWithCustomFormat(this.task?.nextDate, 'DD/MM/yyyy HH:mm:ss'),
                    disabled: true,
                },
                [],
            ),
            lastExecutionDate: new UntypedFormControl(
                {
                    value: DateUtils.formatInputDateTimeWithCustomFormat(this.task?.lastExecutionDate, 'DD/MM/yyyy HH:mm:ss'),
                    disabled: true,
                },
                [],
            ),
            updatedDate: new UntypedFormControl({ value: this.task?.updatedDate, disabled: true }, []),
            disabled: new UntypedFormControl({ value: this.task?.disabled || false, disabled: false }, [Validators.required]),
            inAppNotification: new UntypedFormControl({ value: this.task?.inAppNotification || false, disabled: false }, [
                Validators.required,
            ]),
            sendMail: new UntypedFormControl({ value: this.task?.sendMail || false, disabled: false }, [Validators.required]),
            sendSms: new UntypedFormControl({ value: this.task?.sendSms || false, disabled: false }, [Validators.required]),
            persistResult: new UntypedFormControl({ value: this.task?.persistResult || false, disabled: false }, []),
            title: new UntypedFormControl({ value: this.task?.title, disabled: false }, [Validators.required]),
            description: new UntypedFormControl({ value: this.task?.description, disabled: false }, [Validators.required]),
        });

        this.form.controls.hasAction.valueChanges.subscribe((v) => {
            if (!v) {
                this.form.controls.actionParameters = this.fb.array([]);
                this.form.controls.actionKey.patchValue(null);
                this.form.controls.customActionName.patchValue(null);
                this.form.controls.description.patchValue(null);
                this.form.controls.title.patchValue(null);
                this.form.controls.action.patchValue(null);
            }
        });

        this.form.controls.hasSpecificDate.valueChanges.subscribe((v) => {
            if (v) {
                this.form.controls.cronExpression.patchValue(null);
            } else {
                this.form.controls.specificDate.patchValue(null);
                this.form.controls.calendarDate.patchValue(null);
            }
        });
        this.form.controls.quickDateSelect.valueChanges.subscribe((v) => {
            if (v) {
                let targetDate = new Date();

                switch (v) {
                    case '1week':
                        targetDate.setDate(targetDate.getDate() + 7);
                        targetDate.setHours(2, 0, 0, 0);
                        break;
                    case '1month':
                        targetDate.setMonth(targetDate.getMonth() + 1);
                        targetDate.setHours(2, 0, 0, 0);
                        break;
                    case 'nextMorning':
                        targetDate.setDate(targetDate.getDate() + 1);
                        targetDate.setHours(2, 0, 0, 0);
                        break;
                    case '1day':
                        targetDate.setDate(targetDate.getDate() + 1);
                        break;
                    case '1hour':
                        targetDate.setHours(targetDate.getHours() + 1);
                        break;
                    case 'now':
                        break;
                    case '1min':
                        targetDate.setMinutes(targetDate.getMinutes() + 1);
                        break;
                    case '8hour':
                        targetDate.setHours(targetDate.getHours() + 8);
                        break;
                    case 'nextFriday':
                        const daysUntilFriday = (5 - targetDate.getDay() + 7) % 7 || 7;
                        targetDate.setDate(targetDate.getDate() + daysUntilFriday);
                        targetDate.setHours(2, 0, 0, 0);
                        break;
                    case 'nextSunday':
                        const daysUntilSunday = (7 - targetDate.getDay()) % 7 || 7;
                        targetDate.setDate(targetDate.getDate() + daysUntilSunday);
                        targetDate.setHours(2, 0, 0, 0);
                        break;
                }

                this.form.controls.hasSpecificDate.patchValue(true);
                this.form.controls.cronExpression.patchValue(null);
                this.form.controls.specificDate.patchValue(DateUtils.formatInputDateTime(targetDate));
            }
        });

        this.form.controls.action.valueChanges.subscribe((v) => {
            if (v) {
                this.form.controls.actionParameters = this.fb.array([]);
                v.allowedParameters.map(this.convertParameter).forEach((p: any) => this.actionParameters.push(p));
                this.form.controls.actionKey.patchValue(v.key);
                this.form.controls.customActionName.patchValue(null);
                this.form.controls.title.patchValue(v.title);
                this.form.controls.description.patchValue(v.description);
                this.form.controls.cronExpression.patchValue(v.defaultCronValue || '0 0 * * * *');
                this.form.controls.hasSpecificDate.patchValue(null);
            }
        });
    }

    get action(): ActionMetadata {
        return this.form?.controls?.action?.value;
    }

    get actionParameters(): UntypedFormArray {
        return this.form.get('actionParameters') as UntypedFormArray;
    }

    openCronExpressionHelp() {
        this.modalService.open(CronExpressionHelpComponent, { size: 'lg' });
    }

    convertParameter(parameter: ActionParameter): UntypedFormGroup {
        return new UntypedFormGroup({
            key: new UntypedFormControl(
                {
                    value: parameter.key,
                    disabled: true,
                },
                [Validators.required],
            ),
            parameterValue: new UntypedFormControl(
                {
                    value: parameter.value,
                    disabled: false,
                },
                parameter.required ? [Validators.required] : [],
            ),
            parameterType: new UntypedFormControl(
                {
                    value: parameter.parameterType,
                    disabled: true,
                },
                parameter.required ? [Validators.required] : [],
            ),
        });
    }
    findInvalidControls() {
        const invalid = [];
        const controls = this.form.controls;
        for (const name in controls) {
            if (controls[name].invalid) {
                invalid.push(name);
            }
        }
        return invalid;
    }

    get hasSpecificDate(): boolean {
        return this.form.get('hasSpecificDate').value;
    }

    get actionKey(): string {
        return this.form.get('actionKey').value;
    }

    get hasAction(): boolean {
        return this.form.get('hasAction').value;
    }

    send() {
        const specificDate = this.specificDate;
        const calendarDate = this.calendarDate;

        this.onSaveTask.emit({
            id: this.task?.id,
            actionParameters: this.hasAction
                ? this.actionParameters?.controls?.map((c) => {
                    return {
                        key: c.get('key').value,
                        value: c.get('parameterValue').value,
                        parameterType: c.get('parameterType').value,
                    };
                })
                : null,
            actionKey: this.form.get('actionKey').value,
            customActionName: this.form.get('customActionName').value,
            inAppNotification: this.form.get('inAppNotification').value,
            description: this.form.get('description').value,
            title: this.form.get('title').value,
            disabled: this.form.get('disabled').value,
            sendMail: this.form.get('sendMail').value,
            sendSms: this.form.get('sendSms').value,
            persistResult: this.form.get('persistResult').value,
            cronExpression: !this.hasSpecificDate ? this.cronExpression : null,
            specificDate: this.hasSpecificDate ? DateUtils.dateStrToUtc(specificDate) : null,
            calendarDate: this.hasSpecificDate && calendarDate ? DateUtils.dateStrToUtc(calendarDate) : null,
            lastExecutionDate: this.task?.lastExecutionDate,
        });
        this.form.reset();
    }

    get cronExpression() {
        return this.form.get('cronExpression').value;
    }

    get specificDate() {
        return this.form.get('specificDate').value;
    }

    get calendarDate() {
        return this.form.get('calendarDate').value;
    }

    clone($event: MouseEvent) {
        $event.stopPropagation();
        $event.preventDefault();
        this.onCloneTask.emit(this.task);
    }
    delete($event: MouseEvent) {
        $event.stopPropagation();
        $event.preventDefault();

        if (isPlatformBrowser(this.platformId)) {
            let resp = this.windowService.nativeWindow.confirm('Are you sure you want to delete this record? ');
            if (resp) {
                this.onDeleteTask.emit(this.task);
            }
        }
    }

    getDescription(control: any) {
        const parameterKey = control?.controls?.key?.value;
        return this.action?.allowedParameters?.find((p) => p.key === parameterKey)?.description;
    }
    getType(control: any): ActionParameterType {
        const parameterKey = control?.controls?.key?.value;
        return this.action?.allowedParameters?.find((p) => p.key === parameterKey)?.parameterType;
    }
    getOptions(control: any) {
        const parameterKey = control?.controls?.key?.value;
        return this.action?.allowedParameters?.find((p) => p.key === parameterKey)?.options;
    }
    isOption(control: any) {
        return this.getType(control) === 'OPTION';
    }
    isBigString(control: any) {
        return this.getType(control) === 'BIG_STRING';
    }
}
