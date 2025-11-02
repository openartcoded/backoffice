import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NgbCarouselModule,
  NgbDropdownModule,
  NgbNavModule,
  NgbPaginationModule,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { PostsComponent } from './posts/posts.component';
import { PostEditorComponent } from './post-editor/post-editor.component';
import { ReportRoutingModule } from './report-routing.module';
import { NgxFileDropModule } from 'ngx-file-drop';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { ChipsModule } from 'primeng/chips';
import { MarkdownModule } from 'ngx-markdown';
import { AutosizeModule } from 'ngx-autosize';
import { ScrumBoardComponent } from './scrum-board/scrum-board.component';
@NgModule({
  declarations: [PostsComponent, PostEditorComponent, PostDetailComponent, ScrumBoardComponent],
  exports: [],
  imports: [
    CommonModule,
    NgbTooltipModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    AutosizeModule,
    SharedModule,
    MarkdownModule.forRoot({}),
    ChipsModule,
    NgbPaginationModule,
    ReportRoutingModule,
    FormsModule,
    NgbCarouselModule,
    NgxFileDropModule,
    NgbNavModule,
  ],
})
export class ReportModule {}
