import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FileService } from '@core/service/file.service';
import { Title } from '@angular/platform-browser';
import { FileUpload, FileUploadSearchCriteria } from '@core/models/file-upload';
import { Page } from '@core/models/page';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';

@Component({
  selector: 'app-file-upload-table',
  templateUrl: './file-upload-table.component.html',
  styleUrls: ['./file-upload-table.component.scss'],
})
export class FileUploadTableComponent implements OnInit {
  fileUploads: Page<FileUpload>;
  pageSize: number = 5;
  searchCriteria: FileUploadSearchCriteria;

  constructor(
    private fileService: FileService,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private modalService: NgbModal,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('File Uploads');
    this.search({});
  }

  search(criteria: FileUploadSearchCriteria) {
    this.searchCriteria = criteria;
    this.load();
  }

  download(upl: FileUpload) {
    this.fileService.download(upl);
  }

  delete(upl: FileUpload) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this file? ')) {
        this.fileService.delete(upl).subscribe((d) => {
          this.search(this.searchCriteria);
        });
      }
    }
  }

  get pageNumber() {
    return this?.fileUploads?.pageable?.pageNumber + 1;
  }

  load(event: number = 1) {
    this.fileService.findAll(this.searchCriteria, event, this.pageSize).subscribe((data) => (this.fileUploads = data));
  }

  openPdfViewer(a: FileUpload) {
    let ngbModalRef = this.modalService.open(PdfViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.pdf = a;
    ngbModalRef.componentInstance.title = a.metadata?.originalFilename;
  }

  openImageViewer(a: FileUpload) {
    let ngbModalRef = this.modalService.open(ImageViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.image = a;
    ngbModalRef.componentInstance.title = a.metadata?.originalFilename;
  }

  isPdf(upl: FileUpload) {
    return FileService.isPdf(upl.metadata.contentType);
  }

  isImage(upl: FileUpload) {
    return FileService.isImage(upl.metadata.contentType);
  }
}
