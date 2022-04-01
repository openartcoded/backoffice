import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GdprComponent } from './gdpr/gdpr.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [GdprComponent],
  exports: [GdprComponent],
  imports: [CommonModule, RouterModule],
})
export class GdprModule {}
