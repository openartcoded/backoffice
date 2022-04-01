import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AdministrativeDocumentSearchCriteria } from '@core/models/administrative-document';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-document-search-form',
  templateUrl: './document-search-form.component.html',
  styleUrls: ['./document-search-form.component.scss'],
})
export class DocumentSearchFormComponent implements OnInit {
  searchForm: FormGroup;

  @Input()
  searchCriteria: AdministrativeDocumentSearchCriteria;

  @Output()
  formSubmitted: EventEmitter<AdministrativeDocumentSearchCriteria> = new EventEmitter<AdministrativeDocumentSearchCriteria>();

  isCollapsed: boolean = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      title: new FormControl('', []),
      description: new FormControl('', []),
      tags: new FormControl([], []),
      dateBefore: new FormControl('', []),
      dateAfter: new FormControl('', []),
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
    this.searchCriteria.dateBefore = DateUtils.toOptionalDate(this.searchForm.controls.dateBefore.value);
    this.searchCriteria.dateAfter = DateUtils.toOptionalDate(this.searchForm.controls.dateAfter.value);
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
