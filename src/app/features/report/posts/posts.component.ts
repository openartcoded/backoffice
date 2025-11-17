import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '@core/models/page';
import { Post, PostSearchCriteria, PostStatus, Priority } from '@core/models/post';
import { ReportService } from '@core/service/report.service';
import { FileService } from '@core/service/file.service';
import { SlugifyPipe } from '@core/pipe/slugify-pipe';
import { Meta, Title } from '@angular/platform-browser';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { ToastService } from '@core/service/toast.service';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss'],
    standalone: false,
})
export class PostsComponent implements OnInit {
    posts: Page<Post>;
    tags: string[];
    @Input()
    statusFilter?: PostStatus = null;
    @Input()
    priorityFilter?: Priority = null;

    @Input()
    disableStatusFilter = false;
    @Input()
    disablePriorityFilter = false;
    defaultPageSize: number = 5;
    markdownContainerOptions = { showBorder: false };
    searchInput: string;
    selectedTag: string;
    searchCriteria: PostSearchCriteria = {};
    @Input()
    bookmarked?: boolean = null;
    constructor(
        private reportService: ReportService,
        private titleService: Title,
        private toastService: ToastService,
        private metaService: Meta,
        @Inject(PLATFORM_ID) private platformId: any,
        private windowRefService: WindowRefService,
        private slugifyPipe: SlugifyPipe,
        protected fileService: FileService,
    ) { }

    ngOnInit(): void {
        this.titleService.setTitle('Activity Report');
        this.metaService.updateTag({
            name: 'description',
            content: 'activity reports',
        });
        this.reportService.getTags().subscribe((data) => (this.tags = data));

        this.load();
    }

    load(event: number = 1): void {
        this.reportService
            .adminSearch({
                bookmarked: this.bookmarked,
                priority: this.priorityFilter,
                status: this.statusFilter, ...this.searchCriteria
            }, event - 1, this.defaultPageSize)
            .subscribe((data) => (this.posts = data));
    }

    get pageNumber() {
        return this?.posts?.page?.number + 1;
    }

    delete(post: Post) {
        if (isPlatformBrowser(this.platformId)) {
            if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete this post?')) {
                this.reportService.delete(post).subscribe((data) => {
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
    toggleBookmark($event: MouseEvent, post: Post) {
        $event.stopPropagation();
        this.reportService.toggleBookmarked(post.id).subscribe((_) => {
            this.toastService.showSuccess('Bookmark toggled. Reload...');
            post.bookmarked = !post.bookmarked;
            const index = this.posts.content.findIndex((d) => d.id && d.id === post.id);
            if (index !== -1) {
                const newArray =
                    this.bookmarked && !post.bookmarked
                        ? this.posts.content.filter((x) => x.id !== post.id)
                        : this.posts.content.map((item, i) => (i === index ? post : item));
                this.posts.content = newArray;
            }
        });
    }
    search(tag?: string) {
        // toggle
        this.selectedTag = tag || this.selectedTag;

        if (!this.searchInput?.length && !this.selectedTag && !this.priorityFilter && !this.statusFilter) {
            this.searchCriteria = { bookmarked: this.bookmarked };
            this.load();
        }

        let textSearch = this.searchInput?.length >= 3 ? this.searchInput : null;
        if (textSearch || this.selectedTag || this.priorityFilter || this.statusFilter) {
            this.searchCriteria = {
                title: textSearch,
                priority: this.priorityFilter,
                status: this.statusFilter,
                content: textSearch,
                bookmarked: this.bookmarked,
                tag: this.selectedTag,
            };
            this.load();
        }
    }
}
