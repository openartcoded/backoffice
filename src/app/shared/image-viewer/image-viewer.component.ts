import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileService } from '@core/service/file.service';
import { FileUpload } from '@core/models/file-upload';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
    selector: 'app-image-viewer',
    templateUrl: './image-viewer.component.html',
    styleUrls: ['./image-viewer.component.scss'],
    standalone: false
})
export class ImageViewerComponent implements OnInit {
  @Input()
  image: FileUpload;
  @Input()
  title: string = '';

  imageSrc: any;

  constructor(
    public activeModal: NgbActiveModal,
    private domSanitizationService: DomSanitizer,
    private fileService: FileService
  ) {}

  ngOnInit(): void {
    this.fileService
      .toDownloadLink(this.fileService.getDownloadUrl(this.image.id))
      .subscribe((link) => (this.imageSrc = this.domSanitizationService.bypassSecurityTrustUrl(link.href)));
  }
}
