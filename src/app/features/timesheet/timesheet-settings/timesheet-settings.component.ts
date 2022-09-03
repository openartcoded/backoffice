import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { TimesheetSettings, TimesheetSettingsForm } from '@core/models/timesheet';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { BillableClient } from '@core/models/billable-client';

@Component({
  selector: 'app-timesheet-settings',
  templateUrl: './timesheet-settings.component.html',
  styleUrls: ['./timesheet-settings.component.scss'],
})
export class TimesheetSettingsComponent implements OnInit {
  @Output()
  onSubmitForm: EventEmitter<TimesheetSettingsForm> = new EventEmitter<TimesheetSettingsForm>();

  @Input()
  settings: TimesheetSettingsForm;

  @Input()
  clients: BillableClient[];

  form: UntypedFormGroup;

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      minHoursPerDay: new UntypedFormControl(
        {
          value: this.settings?.minHoursPerDay,
          disabled: false,
        },
        [Validators.required, Validators.min(0)]
      ),
      maxHoursPerDay: new UntypedFormControl(
        {
          value: this.settings?.maxHoursPerDay,
          disabled: false,
        },
        [Validators.required, Validators.min(0.5)]
      ),
      clientId: new UntypedFormControl(
        {
          value: this.settings?.clientId,
          disabled: false,
        },
        [Validators.required]
      ),
    });
  }

  send() {
    const newSettings: TimesheetSettingsForm = {
      maxHoursPerDay: this.form.controls.maxHoursPerDay.value,
      minHoursPerDay: this.form.controls.minHoursPerDay.value,
      clientId: this.form.controls.clientId.value,
      timesheetId: this.settings.timesheetId
    };
    this.onSubmitForm.emit(newSettings);
  }
}
