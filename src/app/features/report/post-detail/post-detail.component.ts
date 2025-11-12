import { AfterViewChecked, Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@core/models/post';
import { FileService } from '@core/service/file.service';
import { ReportService } from '@core/service/report.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { DateUtils } from '@core/utils/date-utils';
import { firstValueFrom } from 'rxjs';
import Prism from 'prismjs';
import { FileUpload } from '@core/models/file-upload';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
  standalone: false,
})
export class PostDetailComponent implements OnInit, AfterViewChecked {
  post: Post;
  cover?: FileUpload;
  id: string;

  ngAfterViewChecked() {
    Prism.highlightAll();
  }
  constructor(
    private activateRoute: ActivatedRoute,
    private modalService: NgbModal,
    private fileService: FileService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: any,
    private metaService: Meta,
    private reportService: ReportService,
  ) {}

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.load();
  }
  isProcessed(a: FileUpload) {
    return this.post.processedAttachmentIds?.includes(a.id);
  }
  async load() {
    this.post = await firstValueFrom(this.reportService.getPostById(this.id));

    if (this.post.coverId) {
      this.cover = await firstValueFrom(this.fileService.findById(this.post.coverId));
    }
    this.reloadAttachments();

    this.updateMetas();
  }

  getCoverUrl() {
    if (this.post.coverId) {
      return this.fileService.getDownloadUrl(this.post.coverId);
    }
    return '/assets/img/no-cover.jpg';
  }
  async downloadBulk(attachments: FileUpload[]) {
    await this.fileService.downloadBulk(attachments.map((a) => a.id));
  }
  async reloadAttachments() {
    let attachments = [];
    if (!this.post.attachments) {
      this.post.attachments = [];
    }
    if (this.post.attachmentIds?.length) {
      attachments = await firstValueFrom(this.fileService.findByIds(this.post.attachmentIds));
    }

    // this could be refactored 2025-11-09 11:34
    const thumbs = attachments
      .map((u) => u.thumbnailId)
      .filter((u) => u?.length)
      .map((id) => {
        return { id } as FileUpload;
      });
    for (const upload of attachments) {
      if (upload.thumbnailId?.length) {
        const thumb = thumbs.find((t) => upload.thumbnailId === t.id);
        upload.transientThumbnail = thumb;
      }
    }
    this.post.attachments = attachments;
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
  isXML(upl: FileUpload) {
    return FileService.isXML(upl?.contentType);
  }
  isImage(upl: FileUpload) {
    return FileService.isImage(upl?.contentType);
  }
  download(upl: FileUpload) {
    this.fileService.download(upl);
  }

  generatePdf() {
    this.reportService.generatePdf(this.post);
  }

  private updateMetas() {
    this.titleService.setTitle(this.post.title);
    this.metaService.updateTag({
      name: 'description',
      content: this.post.description,
    });
    this.metaService.updateTag({
      property: 'og:description',
      content: this.post.description,
    });
    this.metaService.updateTag({
      property: 'og:title',
      content: this.post.title,
    });
    this.metaService.updateTag({
      property: 'og:image',
      content: this.getCoverUrl(),
    });
    this.metaService.updateTag({
      property: 'twitter:description',
      content: this.post.description,
    });
    this.metaService.updateTag({
      property: 'twitter:title',
      content: this.post.title,
    });
    this.metaService.updateTag({
      property: 'twitter:image',
      content: this.getCoverUrl(),
    });
    this.metaService.updateTag({
      name: 'publish_date',
      property: 'og:publish_date',
      content: DateUtils.getIsoDateFromBackend(this.post.creationDate),
    });
    this.metaService.updateTag({
      property: 'og:url',
      content: this.document.location.href,
    });
    this.metaService.updateTag({
      property: 'twitter:url',
      content: this.document.location.href,
    });
    this.metaService.updateTag({
      name: 'author',
      content: 'Nordine Bittich',
    });
  }
}
