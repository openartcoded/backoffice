import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { FileService } from '@core/service/file.service';
import { Title } from '@angular/platform-browser';
import { FileUpload, FileUploadSearchCriteria } from '@core/models/file-upload';
import { Page } from '@core/models/page';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { ToastService } from '@core/service/toast.service';

@Component({
  selector: 'app-file-upload-table',
  templateUrl: './file-upload-table.component.html',
  styleUrls: ['./file-upload-table.component.scss'],
  standalone: false,
})
export class FileUploadTableComponent implements OnInit {
  fileUploads: Page<FileUpload>;
  correlationLinks: Record<string, string | null>;

  @Input()
  bookmarked: boolean = false;

  pageSize: number = 10;
  searchCriteria: FileUploadSearchCriteria;

  user: User;
  demoMode: boolean;
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  constructor(
    private fileService: FileService,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private toastService: ToastService,
    private personalInfoService: PersonalInfoService,
    private modalService: NgbModal,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('File Uploads');
    this.search({ bookmarked: this.bookmarked });
    this.fileService.getCorrelationLinks().subscribe((links) => (this.correlationLinks = links));
    this.personalInfoService.me().subscribe((u) => (this.user = u));
    this.personalInfoService.get().subscribe((u) => (this.demoMode = u.demoMode));
  }

  search(criteria: FileUploadSearchCriteria) {
    this.searchCriteria = criteria;
    this.load();
  }

  download(upl: FileUpload) {
    this.fileService.download(upl);
  }

  delete(upl: FileUpload) {
    if (!this.hasRoleAdmin) {
      return;
    }
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this file? ')) {
        this.fileService.delete(upl).subscribe((_d) => {
          this.search(this.searchCriteria);
        });
      }
    }
  }

  get pageNumber() {
    return this?.fileUploads?.page?.number + 1;
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
    ngbModalRef.componentInstance.title = a?.originalFilename;
  }

  openImageViewer(a: FileUpload) {
    let ngbModalRef = this.modalService.open(ImageViewerComponent, {
      size: 'xl',
      scrollable: true,
    });
    ngbModalRef.componentInstance.image = a;
    ngbModalRef.componentInstance.title = a?.originalFilename;
  }

  isPdf(upl: FileUpload) {
    return FileService.isPdf(upl?.contentType);
  }

  isImage(upl: FileUpload) {
    return FileService.isImage(upl?.contentType);
  }
  toggleBookmark($event: MouseEvent, upl: FileUpload) {
    $event.stopPropagation();
    this.fileService.toggleBookmarked(upl.id).subscribe((fee) => {
      this.toastService.showSuccess('Bookmark toggled. Reload...');
      upl.bookmarked = !upl.bookmarked;
      const index = this.fileUploads.content.findIndex((d, idx) => d.id && d.id === upl.id);
      if (index !== -1) {
        const newArray =
          this.bookmarked && !upl.bookmarked
            ? this.fileUploads.content.filter((x) => x.id !== upl.id)
            : this.fileUploads.content.map((item, i) => (i === index ? upl : item));
        this.fileUploads.content = newArray;
      }
    });
  }
}
