import { Component, OnInit, Optional } from '@angular/core';
import { PdfService } from '@core/service/pdf.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-split-pdf',
  templateUrl: './split-pdf.component.html',
  styleUrls: ['./split-pdf.component.scss'],
})
export class SplitPdfComponent implements OnInit {
  file: File;

  constructor(@Optional() public activeModal: NgbActiveModal, private pdfService: PdfService) {}
  ngOnInit(): void {}

  loadFile($event) {
    this.file = $event.target.files[0];
  }

  split(){
    this.pdfService.split(this.file);
  }
}
