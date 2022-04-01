import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { FinancePageComponent } from './finance-page/finance-page.component';
import { NgbDropdownModule, NgbNavModule, NgbProgressbarModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { PortfolioFormComponent } from './portfolio-form/portfolio-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TicksComponent } from './ticks/ticks.component';
import { TickChartComponent } from './tick-chart/tick-chart.component';
import { SelectPortfolioComponent } from './select-portfolio/select-portfolio.component';
import { FinanceRoutingModule } from './finance-routing.module';
import PlotlyUniversalModule from '@feature/plotly-universal/plotly-universal.module';

@NgModule({
  declarations: [
    FinancePageComponent,
    PortfolioComponent,
    PortfolioFormComponent,
    TicksComponent,
    TickChartComponent,
    SelectPortfolioComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FinanceRoutingModule,
    NgbNavModule,
    ReactiveFormsModule,
    FormsModule,
    FontAwesomeModule,
    PlotlyUniversalModule,
    NgbTypeaheadModule,
    NgbProgressbarModule,
    NgbDropdownModule,
  ],
})
export class FinanceModule {}
