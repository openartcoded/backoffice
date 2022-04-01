import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FeeSearchCriteria, FeeTagColor } from '@core/models/fee';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-fee-search-form',
  templateUrl: './fee-search-form.component.html',
  styleUrls: ['./fee-search-form.component.scss'],
})
export class FeeSearchFormComponent implements OnInit {
  searchForm: FormGroup;

  @Input()
  tags: FeeTagColor[];

  @Input()
  searchCriteria: FeeSearchCriteria;

  @Output()
  formSubmitted: EventEmitter<FeeSearchCriteria> = new EventEmitter<FeeSearchCriteria>();

  isCollapsed: boolean = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      feeId: new FormControl(this.searchCriteria.id, []),
      feeTag: new FormControl(this.searchCriteria.tag, []),
      feeSubject: new FormControl(this.searchCriteria.subject, []),
      feeBody: new FormControl(this.searchCriteria.body, []),
      feeDateBefore: new FormControl('', []),
      feeDateAfter: new FormControl('', []),
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
      this.searchCriteria.datebefore = DateUtils.getDateFromInput(this.searchForm.controls.feeDateBefore.value);
    } else {
      this.searchCriteria.datebefore = null;
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
    this.searchCriteria.datebefore = null;
    this.searchCriteria.dateAfter = null;
    this.searchCriteria.id = null;
    this.searchCriteria.tag = null;
  }
}
