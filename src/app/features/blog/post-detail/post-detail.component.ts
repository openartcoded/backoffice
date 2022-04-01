import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from '@core/models/post';
import { FileService } from '@core/service/file.service';
import { BlogService } from '@core/service/blog.service';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.scss'],
})
export class PostDetailComponent implements OnInit {
  post: Post;
  id: string;

  constructor(
    private activateRoute: ActivatedRoute,
    private fileService: FileService,
    private titleService: Title,
    @Inject(DOCUMENT) private document: any,
    private metaService: Meta,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.id = this.activateRoute.snapshot.params.id;
    this.load();
  }

  load() {
    this.blogService.getPostById(this.id).subscribe((p) => {
      this.post = p;
      this.updateMetas();
    });
  }

  getCoverUrl() {
    if (this.post.coverId) {
      return this.fileService.getPublicDownloadUrl(this.post.coverId);
    }
    return '/assets/img/no-cover.jpg';
  }

  generatePdf() {
    this.blogService.generatePdf(this.post);
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

  async resetCount() {
    await this.blogService.resetPostCount(this.post.id).toPromise();
    this.load();
  }
}
