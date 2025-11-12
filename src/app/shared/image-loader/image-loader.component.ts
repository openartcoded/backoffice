import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { FileUpload } from '@core/models/file-upload';
import { FileService } from '@core/service/file.service';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss'],
  standalone: false,
})
export class ImageLoaderComponent implements OnInit {
  @Input() loader: string = '/assets/img/loader.gif';
  @Input() image: FileUpload;
  @Input() cssClass: string;

  imageSrc: any;
  thumbnailSrc: any;
  isLoading: boolean = true;
  isImageLoaded: boolean = false;

  constructor(
    private fileService: FileService,
    private domSanitizationService: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loadThumbnailIfAvailable();
  }

  private loadThumbnailIfAvailable() {
    if (this.image.thumbnailId) {
      this.fileService
        .toDownloadLink(this.fileService.getDownloadUrl(this.image.thumbnailId))
        .subscribe((thumbLink) => {
          this.thumbnailSrc = this.domSanitizationService.bypassSecurityTrustUrl(thumbLink.href);
          this.loadMainImage();
        });
    } else {
      this.loadMainImage();
    }
  }

  private loadMainImage() {
    this.fileService.toDownloadLink(this.fileService.getDownloadUrl(this.image.id)).subscribe((link) => {
      this.imageSrc = this.domSanitizationService.bypassSecurityTrustUrl(link.href);
    });
  }

  hideLoader() {
    this.isLoading = false;
    this.isImageLoaded = true;
  }
}
