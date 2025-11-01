import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Page } from '@core/models/page';
import { Post, PostSearchCriteria } from '@core/models/post';
import { ReportService } from '@core/service/report.service';
import { FileService } from '@core/service/file.service';
import { SlugifyPipe } from '@core/pipe/slugify-pipe';
import { Meta, Title } from '@angular/platform-browser';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-posts',
    templateUrl: './posts.component.html',
    styleUrls: ['./posts.component.scss'],
    standalone: false,
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
        private reportService: ReportService,
        private titleService: Title,
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
        this.load();
    }

    load(event: number = 1): void {
        this.reportService
            .adminSearch(this.searchCriteria, event - 1, this.defaultPageSize)
            .subscribe((data) => (this.posts = data));
        this.reportService.getTags().subscribe((data) => (this.tags = data));
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
