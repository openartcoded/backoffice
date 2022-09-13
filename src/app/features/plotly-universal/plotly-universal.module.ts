import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlotlyService, PlotlySharedModule } from 'angular-plotly.js';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, PlotlySharedModule],
  providers: [PlotlyService],
  exports: [PlotlySharedModule],
})
export default class PlotlyUniversalModule {
  constructor(@Inject(PLATFORM_ID) private platformId: any, private windowService: WindowRefService) {
    if (isPlatformBrowser(this.platformId)) {
      const plotly = (this.windowService.nativeWindow as any).Plotly;
      if (typeof plotly === 'undefined') {
        throw new Error(`Plotly object not found on window.`);
      }
      PlotlyService.setPlotly(plotly);
    }
  }
}
