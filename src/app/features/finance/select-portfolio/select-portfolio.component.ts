import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Portfolio } from '@core/models/portfolio';

@Component({
  selector: 'app-select-portfolio',
  templateUrl: './select-portfolio.component.html',
  styleUrls: ['./select-portfolio.component.scss'],
})
export class SelectPortfolioComponent implements OnInit {
  @Input()
  selectedPortfolio: Portfolio;
  @Input()
  portfolios: Portfolio[];
  @Output()
  portfolioChanged: EventEmitter<Portfolio> = new EventEmitter<Portfolio>();

  constructor() {}

  ngOnInit(): void {}

  onPortfolioChanged() {
    this.portfolioChanged.emit(this.selectedPortfolio);
  }
}
