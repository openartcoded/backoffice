import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '@core/models/page';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PostEditorComponent } from '../post-editor/post-editor.component';
import { Post, PostSearchCriteria } from '@core/models/post';
import { BlogService } from '@core/service/blog.service';
import { FileService } from '@core/service/file.service';
import { SlugifyPipe } from '@core/pipe/slugify-pipe';
import { Meta, Title } from '@angular/platform-browser';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.scss'],
})
export class PostsComponent implements OnInit {
  posts: Page<Post>;
  tags: string[];
  defaultPageSize: number = 5;
  markdownContainerOptions = { showBorder: false };
  searchInput: string;
  selectedTag: string;
  searchCriteria: PostSearchCriteria = {};

  constructor(
    private blogService: BlogService,
    private titleService: Title,
    private metaService: Meta,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private slugifyPipe: SlugifyPipe,
    protected fileService: FileService,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Blog - Nordine Bittich');
    this.metaService.updateTag({
      name: 'description',
      content: 'My thoughts about programming, along with tutorials, and random stuff I want to talk about',
    });
    this.load();
  }

  load(event: number = 1): void {
    this.blogService
      .adminSearch(this.searchCriteria, event - 1, this.defaultPageSize)
      .subscribe((data) => (this.posts = data));
    this.blogService.getTags().subscribe((data) => (this.tags = data));
  }

  get pageNumber() {
    return this?.posts?.pageable?.pageNumber + 1;
  }

  async openFormModal(post: Post) {
    let postWithDetails = await this.blogService.getPostById(post.id).toPromise();

    const modalRef = this.modalService.open(PostEditorComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.post = postWithDetails;
    modalRef.componentInstance.saved.subscribe((post) => this.load());
  }

  newPost(): void {
    this.blogService.newPost().subscribe((post) => {
      this.load();
      const modalRef = this.modalService.open(PostEditorComponent, {
        size: 'xl',
      });
      modalRef.componentInstance.post = post;
      modalRef.componentInstance.saved.subscribe((post) => this.load());
    });
  }

  delete(post: Post) {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this post?')) {
        this.blogService.delete(post).subscribe((data) => {
          console.log(data.message);
          this.load();
        });
      }
    }
  }

  getUrlForCover(post: Post) {
    return this.fileService.getPublicDownloadUrl(post.coverId);
  }

  slugify(title: string) {
    return this.slugifyPipe.transform(title);
  }

  search(tag?: string) {
    // toggle
    this.selectedTag = this.selectedTag === tag ? null : tag;

    if (!this.searchInput?.length && !this.selectedTag) {
      this.searchCriteria = {};
      this.load();
    }

    let textSearch = this.searchInput?.length >= 3 ? this.searchInput : null;
    if (textSearch || this.selectedTag) {
      this.searchCriteria = {
        title: textSearch,
        content: textSearch,
        tag: this.selectedTag,
      };
      this.load();
    }
  }
}
