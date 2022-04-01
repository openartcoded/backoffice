import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Base64ManipulationComponent } from './base64-manipulation/base64-manipulation.component';
import { Base64RoutingModule } from './base64-routing.module';
import { SharedModule } from '@shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { Base64Component } from './base64/base64.component';
import { AutosizeModule } from 'ngx-autosize';
import { ReactiveFormsModule } from '@angular/forms';
import { ImageEncoderComponent } from './image-encoder/image-encoder.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  declarations: [Base64ManipulationComponent, Base64Component, ImageEncoderComponent],
  imports: [
    CommonModule,
    Base64RoutingModule,
    SharedModule,
    NgbNavModule,
    AutosizeModule,
    ReactiveFormsModule,
    NgxFileDropModule,
    FontAwesomeModule,
  ],
})
export class Base64UtilsModule {}
