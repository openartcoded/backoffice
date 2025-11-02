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
  isLoading: boolean;

  constructor(
    private fileService: FileService,
    private domSanitizationService: DomSanitizer,
  ) {}

  hideLoader() {
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.fileService.toDownloadLink(this.fileService.getDownloadUrl(this.image.id)).subscribe((link) => {
      this.imageSrc = this.domSanitizationService.bypassSecurityTrustUrl(link.href);
      this.isLoading = false;
    });
  }
}
