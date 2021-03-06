import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { FileUploadSearchCriteria } from '@core/models/file-upload';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-file-upload-search-form',
  templateUrl: './file-upload-search-form.component.html',
  styleUrls: ['./file-upload-search-form.component.scss'],
})
export class FileUploadSearchFormComponent implements OnInit {
  searchForm: FormGroup;

  @Input()
  searchCriteria: FileUploadSearchCriteria;

  @Output()
  formSubmitted: EventEmitter<FileUploadSearchCriteria> = new EventEmitter<FileUploadSearchCriteria>();

  isCollapsed: boolean = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.searchForm = this.fb.group({
      correlationId: new FormControl('', []),
      publicResource: new FormControl('', []),
      dateBefore: new FormControl('', []),
      dateAfter: new FormControl('', []),
    });
  }

  submit() {
    if (this.searchForm.controls.correlationId.value?.trim()) {
      this.searchCriteria.correlationId = this.searchForm.controls.correlationId.value.trim();
    } else {
      this.searchCriteria.correlationId = null;
    }
    this.searchCriteria.publicResource = this.searchForm.controls.publicResource.value;

    if (this.searchForm.controls.dateBefore.value) {
      this.searchCriteria.dateBefore = DateUtils.getDateFromInput(this.searchForm.controls.dateBefore.value);
    } else {
      this.searchCriteria.dateBefore = null;
    }
    if (this.searchForm.controls.dateAfter.value) {
      this.searchCriteria.dateAfter = DateUtils.getDateFromInput(this.searchForm.controls.dateAfter.value);
    } else {
      this.searchCriteria.dateAfter = null;
    }
    this.formSubmitted.emit(this.searchCriteria);
  }

  resetForm() {
    this.searchForm.reset();
    this.searchCriteria.correlationId = null;
    this.searchCriteria.dateBefore = null;
    this.searchCriteria.dateAfter = null;
    this.searchCriteria.publicResource = null;
  }
}
