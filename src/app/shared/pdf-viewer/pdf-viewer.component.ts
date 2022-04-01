import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUpload } from '@core/models/file-upload';
import { FileService } from '@core/service/file.service';

@Component({
  selector: 'app-pdf-viewer',
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
  @Input()
  pdf: FileUpload;
  @Input()
  title: string = '';
  pdfSrc: any;

  constructor(public activeModal: NgbActiveModal, private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService
      .toDownloadLink(this.fileService.getDownloadUrl(this.pdf.id))
      .subscribe((link) => (this.pdfSrc = link.href));
  }
}
