import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Inject,
  Input,
  OnInit,
  Optional,
  Output,
  PLATFORM_ID,
} from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ActionMetadata, ActionParameter, ReminderTask, ActionParameterType } from '@core/models/reminder-task';
import { firstValueFrom, Observable } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss'],
})
export class TaskDetailComponent implements OnInit {
  @Input()
  task: ReminderTask;

  @Input()
  allowedActions$: Observable<ActionMetadata[]>;
  allowedActions: ActionMetadata[];

  @Output()
  onSaveTask: EventEmitter<ReminderTask> = new EventEmitter<ReminderTask>();
  @Output()
  onDeleteTask: EventEmitter<ReminderTask> = new EventEmitter<ReminderTask>();

  form: UntypedFormGroup;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private cdr: ChangeDetectorRef,
    private windowService: WindowRefService,
    @Inject(PLATFORM_ID) private platformId: any,
    private fb: UntypedFormBuilder
  ) {}

  async ngOnInit() {
    this.allowedActions = await firstValueFrom(this.allowedActions$);
    const specificDate = DateUtils.toOptionalDate(this.task?.specificDate);
    const specificDateFormatted = specificDate ? DateUtils.formatInputDateTime(specificDate) : null;
    this.form = this.fb.group({
      hasSpecificDate: new UntypedFormControl({ value: !!this.task?.specificDate, disabled: false }, []),
      hasAction: new UntypedFormControl({ value: !!this.task?.actionKey, disabled: false }, []),
      specificDate: new UntypedFormControl(
        {
          value: specificDateFormatted,
          disabled: false,
        },
        []
      ),
      cronExpression: new UntypedFormControl({ value: this.task?.cronExpression, disabled: false }, []),
      actionKey: new UntypedFormControl({ value: this.task?.actionKey, disabled: false }, []),
      action: new UntypedFormControl(
        {
          value: this.task?.actionKey ? this.allowedActions.find((action) => action.key === this.task.actionKey) : null,
          disabled: false,
        },
        []
      ),
      actionParameters: this.task?.actionParameters
        ? this.fb.array(this.task?.actionParameters?.map(this.convertParameter))
        : this.fb.array([]),
      dateCreation: new UntypedFormControl({ value: this.task?.dateCreation, disabled: true }, []),
      nextDate: new UntypedFormControl({ value: this.task?.nextDate, disabled: true }, []),
      lastExecutionDate: new UntypedFormControl({ value: this.task?.lastExecutionDate, disabled: true }, []),
      updatedDate: new UntypedFormControl({ value: this.task?.updatedDate, disabled: true }, []),
      disabled: new UntypedFormControl({ value: this.task?.disabled || false, disabled: false }, [Validators.required]),
      inAppNotification: new UntypedFormControl({ value: this.task?.inAppNotification || false, disabled: false }, [
        Validators.required,
      ]),
      sendMail: new UntypedFormControl({ value: this.task?.sendMail || false, disabled: false }, [Validators.required]),
      persistResult: new UntypedFormControl({ value: this.task?.persistResult || false, disabled: false }, []),
      title: new UntypedFormControl({ value: this.task?.title, disabled: false }, [Validators.required]),
      description: new UntypedFormControl({ value: this.task?.description, disabled: false }, [Validators.required]),
    });

    this.form.controls.hasAction.valueChanges.subscribe((v) => {
      if (!v) {
        this.form.controls.actionParameters = this.fb.array([]);
        this.form.controls.actionKey.patchValue(null);
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
      }
    });

    this.form.controls.action.valueChanges.subscribe((v) => {
      if (v) {
        this.form.controls.actionParameters = this.fb.array([]);
        v.allowedParameters.map(this.convertParameter).forEach((p) => this.actionParameters.push(p));
        this.form.controls.actionKey.patchValue(v.key);
        this.form.controls.title.patchValue(v.title);
        this.form.controls.description.patchValue(v.description);
        this.form.controls.cronExpression.patchValue(v.defaultCronValue);
      }
    });
  }

  get action(): ActionMetadata {
    return this.form?.controls?.action?.value;
  }

  get actionParameters(): UntypedFormArray {
    return this.form.get('actionParameters') as UntypedFormArray;
  }

  convertParameter(parameter: ActionParameter): UntypedFormGroup {
    return new UntypedFormGroup({
      key: new UntypedFormControl(
        {
          value: parameter.key,
          disabled: true,
        },
        [Validators.required]
      ),
      parameterValue: new UntypedFormControl(
        {
          value: parameter.value,
          disabled: false,
        },
        parameter.required ? [Validators.required] : []
      ),
      parameterType: new UntypedFormControl(
        {
          value: parameter.parameterType,
          disabled: true,
        },
        parameter.required ? [Validators.required] : []
      ),
    });
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
      inAppNotification: this.form.get('inAppNotification').value,
      description: this.form.get('description').value,
      title: this.form.get('title').value,
      disabled: this.form.get('disabled').value,
      sendMail: this.form.get('sendMail').value,
      persistResult: this.form.get('persistResult').value,
      cronExpression: !this.hasSpecificDate ? this.cronExpression : null,
      specificDate: this.hasSpecificDate ? DateUtils.dateStrToUtc(specificDate) : null,
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

  delete($event: MouseEvent) {
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
    return this.getType(control)?.toLocaleString() == 'OPTION';
  }
}
