import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemePageComponent } from './meme-page/meme-page.component';
import { MemagramRoutingModule } from '@feature/memagram/memagram-routing.module';
import { SharedModule } from '@shared/shared.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCarouselModule, NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { MemagramEditorComponent } from './memagram-editor/memagram-editor.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgxFileDropModule } from 'ngx-file-drop';

@NgModule({
  declarations: [MemePageComponent, MemagramEditorComponent],
  imports: [
    CommonModule,
    MemagramRoutingModule,
    SharedModule,
    FontAwesomeModule,
    NgbPaginationModule,
    NgbCarouselModule,
    ReactiveFormsModule,
    NgxFileDropModule,
  ],
})
export class MemagramModule {}
