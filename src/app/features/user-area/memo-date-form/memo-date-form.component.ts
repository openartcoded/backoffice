import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateInFutureValidator } from '@core/validators/date-in-future.validator';
import { MemoDate } from '@core/models/memo-date';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-memo-date-form',
  templateUrl: './memo-date-form.component.html',
  styleUrls: ['./memo-date-form.component.scss'],
})
export class MemoDateFormComponent implements OnInit {
  addDateMemoForm: UntypedFormGroup;
  @Output()
  addMemo: EventEmitter<MemoDate> = new EventEmitter<MemoDate>();

  constructor(private fb: UntypedFormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.addDateMemoForm = this.fb.group(
      {
        memoLabel: new UntypedFormControl('', [Validators.required]),
        dateSince: new UntypedFormControl('', [Validators.required]),
      },
      {
        validators: DateInFutureValidator('dateSince'),
      }
    );
  }

  add() {
    let label = this.addDateMemoForm.get('memoLabel').value;
    let dateSince = DateUtils.getDateFromInput(this.addDateMemoForm.get('dateSince').value);
    this.addDateMemoForm.reset();
    this.addMemo.emit({
      label: label,
      dateSince: dateSince,
    });
  }
}
