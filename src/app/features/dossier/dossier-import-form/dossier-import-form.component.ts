import { Component, EventEmitter, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dossier-import-form',
  templateUrl: './dossier-import-form.component.html',
  styleUrls: ['./dossier-import-form.component.scss']
})
export class DossierImportFormComponent implements OnInit {
  @Output()
  onUpload: EventEmitter<File> = new EventEmitter<File>();

  file: File;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
  ) { }

  ngOnInit(): void {
  }

  upload() {
    this.onUpload.emit(this.file);
    this.file = null;
  }

  loadFile($event) {
    this.file = $event.target.files[0];
  }

}
