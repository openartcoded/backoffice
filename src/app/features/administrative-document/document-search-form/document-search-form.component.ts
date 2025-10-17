import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { AdministrativeDocumentSearchCriteria } from '@core/models/administrative-document';
import { DateUtils } from '@core/utils/date-utils';
import moment from 'moment-timezone';
@Component({
  selector: 'app-document-search-form',
  templateUrl: './document-search-form.component.html',
  styleUrls: ['./document-search-form.component.scss'],
  standalone: false,
})
export class DocumentSearchFormComponent implements OnInit {
  searchForm: UntypedFormGroup;

  @Input()
  searchCriteria: AdministrativeDocumentSearchCriteria;

  @Output()
  formSubmitted: EventEmitter<AdministrativeDocumentSearchCriteria> =
    new EventEmitter<AdministrativeDocumentSearchCriteria>();

  isCollapsed: boolean = false;

  constructor(private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      title: new UntypedFormControl('', []),
      description: new UntypedFormControl('', []),
      tags: new UntypedFormControl([], []),
      dateBefore: new UntypedFormControl('', []),
      dateAfter: new UntypedFormControl('', []),
    });
  }

  submit() {
    this.searchCriteria.title = this.searchForm.controls.title.value?.trim()
      ? this.searchForm.controls.title.value.trim()
      : null;
    this.searchCriteria.description = this.searchForm.controls.description.value?.trim()
      ? this.searchForm.controls.description.value.trim()
      : null;
    this.searchCriteria.tags = this.searchForm.controls.tags.value?.length ? this.searchForm.controls.tags.value : null;
    this.searchCriteria.dateBefore = moment(DateUtils.getDateFromInput(this.searchForm.controls.dateBefore.value))
      .hours(23)
      .minutes(59)
      .toDate();
    this.searchCriteria.dateAfter = moment(DateUtils.getDateFromInput(this.searchForm.controls.dateAfter.value))
      .hours(1)
      .minutes(0)
      .toDate();
    this.formSubmitted.emit(this.searchCriteria);
  }

  resetForm() {
    this.searchForm.reset();
    this.searchCriteria.title = null;
    this.searchCriteria.description = null;
    this.searchCriteria.tags = null;
    this.searchCriteria.dateBefore = null;
    this.searchCriteria.dateAfter = null;
  }
}
