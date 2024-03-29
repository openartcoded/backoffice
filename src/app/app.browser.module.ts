import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { Offcanvas } from 'bootstrap';
const offcanvasElementList = [].slice.call(document.querySelectorAll('.offcanvas'));
offcanvasElementList.map(function(offcanvasEl) {
  return new Offcanvas(offcanvasEl);
});

@NgModule({
  imports: [BrowserAnimationsModule, AppModule],
  bootstrap: [AppComponent],
})
export class AppBrowserModule { }
