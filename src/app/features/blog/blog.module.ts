import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbCarouselModule, NgbDropdownModule, NgbNavModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { LMarkdownEditorModule } from 'ngx-markdown-editor';
import { PostsComponent } from './posts/posts.component';
import { PostEditorComponent } from './post-editor/post-editor.component';
import { BlogRoutingModule } from './blog-routing.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { ChipsModule } from 'primeng/chips';
import 'ace-builds/src-min-noconflict/ace';
import 'ace-builds/src-min-noconflict/mode-markdown';
import("marked").then(m=> {
    (window as any).marked = m.marked;
});

@NgModule({
  declarations: [PostsComponent, PostEditorComponent, PostDetailComponent],
  exports: [],
  imports: [
    CommonModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    SharedModule,
    ChipsModule,
    NgbPaginationModule,
    LMarkdownEditorModule,
    BlogRoutingModule,
    FormsModule,
    NgbCarouselModule,
    NgxFileDropModule,
    NgbNavModule,
  ],
})
export class BlogModule {}
