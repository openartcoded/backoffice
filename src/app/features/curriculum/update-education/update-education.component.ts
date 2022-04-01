import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ScholarHistory } from '@core/models/curriculum';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-update-education',
  templateUrl: './update-education.component.html',
  styleUrls: ['./update-education.component.scss'],
})
export class UpdateEducationComponent implements OnInit {
  form: FormGroup;

  @Input()
  scholarHistory: ScholarHistory;

  @Output()
  scholarHistorySubmitted: EventEmitter<ScholarHistory> = new EventEmitter<ScholarHistory>();

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: new FormControl(this.scholarHistory?.title, [Validators.required]),
      school: new FormControl(this.scholarHistory?.school, [Validators.required]),
      current: new FormControl(this.scholarHistory?.current || false, [Validators.required]),
      from: new FormControl(DateUtils.formatInputDate(DateUtils.toDateOrNow(this.scholarHistory.from)), [
        Validators.required,
      ]),
      to: new FormControl(
        this.scholarHistory.to ? DateUtils.formatInputDate(DateUtils.toOptionalDate(this.scholarHistory.to)) : null,
        []
      ),
    });
  }

  send() {
    const his: ScholarHistory = {
      from: DateUtils.getDateFromInput(this.form.controls.from.value),
      to: this.current ? null : DateUtils.toOptionalDate(this.form.controls.to.value),
      title: this.form.controls.title.value,
      school: this.form.controls.school.value,
      current: this.current,
    };
    this.scholarHistorySubmitted.emit(his);
    this.form.reset();
  }

  get current(): boolean {
    return this.form.controls.current.value;
  }
}
