import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  imports: [AppModule, ServerModule, NoopAnimationsModule],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
