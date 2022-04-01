import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { TimesheetSettings } from '@core/models/timesheet';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-timesheet-settings',
  templateUrl: './timesheet-settings.component.html',
  styleUrls: ['./timesheet-settings.component.scss'],
})
export class TimesheetSettingsComponent implements OnInit {
  @Output()
  onSubmitForm: EventEmitter<TimesheetSettings> = new EventEmitter<TimesheetSettings>();

  @Input()
  settings: TimesheetSettings;

  form: FormGroup;

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      minHoursPerDay: new FormControl(
        {
          value: this.settings?.minHoursPerDay,
          disabled: false,
        },
        [Validators.required, Validators.min(0)]
      ),
      maxHoursPerDay: new FormControl(
        {
          value: this.settings?.maxHoursPerDay,
          disabled: false,
        },
        [Validators.required, Validators.min(0.5)]
      ),
      defaultProjectName: new FormControl(
        {
          value: this.settings?.defaultProjectName,
          disabled: false,
        },
        [Validators.required]
      ),
    });
  }

  send() {
    const newSettings: TimesheetSettings = {
      maxHoursPerDay: this.form.controls.maxHoursPerDay.value,
      minHoursPerDay: this.form.controls.minHoursPerDay.value,
      defaultProjectName: this.form.controls.defaultProjectName.value,
    };
    this.onSubmitForm.emit(newSettings);
  }
}
