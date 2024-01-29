import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { FileUploadSearchCriteria } from '@core/models/file-upload';
import { User } from '@core/models/user';
import { DateUtils } from '@core/utils/date-utils';

import * as moment from 'moment-timezone';
@Component({
  selector: 'app-file-upload-search-form',
  templateUrl: './file-upload-search-form.component.html',
  styleUrls: ['./file-upload-search-form.component.scss'],
})
export class FileUploadSearchFormComponent implements OnInit {
  searchForm: UntypedFormGroup;

  @Input()
  searchCriteria: FileUploadSearchCriteria;

  @Output()
  formSubmitted: EventEmitter<FileUploadSearchCriteria> = new EventEmitter<FileUploadSearchCriteria>();

  isCollapsed: boolean = false;

  @Input()
  user: User;
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      id: new UntypedFormControl('', []),
      correlationId: new UntypedFormControl('', []),
      publicResource: new UntypedFormControl('', []),
      dateBefore: new UntypedFormControl('', []),
      dateAfter: new UntypedFormControl('', []),
      originalFilename: new UntypedFormControl('', []),
    });
  }

  submit() {
    if (this.searchForm.controls.correlationId.value?.trim()) {
      this.searchCriteria.correlationId = this.searchForm.controls.correlationId.value.trim();
    } else {
      this.searchCriteria.correlationId = null;
    }
    if (this.searchForm.controls.id.value?.trim()) {
      this.searchCriteria.id = this.searchForm.controls.id.value.trim();
    } else {
      this.searchCriteria.id = null;
    }
    this.searchCriteria.publicResource = this.searchForm.controls.publicResource.value;

    if (this.searchForm.controls.dateBefore.value) {
      this.searchCriteria.dateBefore = moment(DateUtils.getDateFromInput(this.searchForm.controls.dateBefore.value))
        .hours(23)
        .minutes(59)
        .toDate();
    } else {
      this.searchCriteria.dateBefore = null;
    }
    if (this.searchForm.controls.originalFilename.value) {
      this.searchCriteria.originalFilename = this.searchForm.controls.originalFilename.value;
    }
    if (this.searchForm.controls.dateAfter.value) {
      this.searchCriteria.dateAfter = moment(DateUtils.getDateFromInput(this.searchForm.controls.dateAfter.value))
        .hours(1)
        .minutes(0)
        .toDate();
    } else {
      this.searchCriteria.dateAfter = null;
    }
    this.formSubmitted.emit(this.searchCriteria);
  }

  resetForm() {
    this.searchForm.reset();
    this.searchCriteria.id = null;
    this.searchCriteria.correlationId = null;
    this.searchCriteria.dateBefore = null;
    this.searchCriteria.dateAfter = null;
    this.searchCriteria.publicResource = null;
    this.searchCriteria.originalFilename = null;
  }
}
