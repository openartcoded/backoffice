import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FeeSearchCriteria, Label } from '@core/models/fee';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-fee-search-form',
  templateUrl: './fee-search-form.component.html',
  styleUrls: ['./fee-search-form.component.scss'],
})
export class FeeSearchFormComponent implements OnInit {
  searchForm: UntypedFormGroup;

  @Input()
  tags: Label[];

  @Input()
  searchCriteria: FeeSearchCriteria;

  @Output()
  formSubmitted: EventEmitter<FeeSearchCriteria> = new EventEmitter<FeeSearchCriteria>();

  isCollapsed: boolean = false;

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      feeId: new UntypedFormControl(this.searchCriteria.id, []),
      feeTag: new UntypedFormControl(this.searchCriteria.tag, []),
      feeSubject: new UntypedFormControl(this.searchCriteria.subject, []),
      feeBody: new UntypedFormControl(this.searchCriteria.body, []),
      feeDateBefore: new UntypedFormControl('', []),
      feeDateAfter: new UntypedFormControl('', []),
    });
  }

  submit() {
    if (this.searchForm.controls.feeSubject.value?.trim()) {
      this.searchCriteria.subject = this.searchForm.controls.feeSubject.value.trim();
    } else {
      this.searchCriteria.subject = null;
    }
    if (this.searchForm.controls.feeSubject.value?.trim()) {
      this.searchCriteria.subject = this.searchForm.controls.feeSubject.value.trim();
    } else {
      this.searchCriteria.subject = null;
    }
    if (this.searchForm.controls.feeBody.value?.trim()) {
      this.searchCriteria.body = this.searchForm.controls.feeBody.value.trim();
    } else {
      this.searchCriteria.body = null;
    }
    if (this.searchForm.controls.feeDateBefore.value) {
      this.searchCriteria.dateBefore = DateUtils.getDateFromInput(this.searchForm.controls.feeDateBefore.value);
    } else {
      this.searchCriteria.dateBefore = null;
    }
    if (this.searchForm.controls.feeDateAfter.value) {
      this.searchCriteria.dateAfter = DateUtils.getDateFromInput(this.searchForm.controls.feeDateAfter.value);
    } else {
      this.searchCriteria.dateAfter = null;
    }
    if (this.searchForm.controls.feeId.value?.trim()) {
      this.searchCriteria.id = this.searchForm.controls.feeId.value.trim();
    } else {
      this.searchCriteria.id = null;
    }
    if (this.searchForm.controls.feeTag.value) {
      this.searchCriteria.tag = this.searchForm.controls.feeTag.value;
    } else {
      this.searchCriteria.tag = null;
    }
    this.formSubmitted.emit(this.searchCriteria);
  }

  resetForm() {
    this.searchForm.reset();
    this.searchCriteria.subject = null;
    this.searchCriteria.subject = null;
    this.searchCriteria.body = null;
    this.searchCriteria.dateBefore = null;
    this.searchCriteria.dateAfter = null;
    this.searchCriteria.id = null;
    this.searchCriteria.tag = null;
  }
}
