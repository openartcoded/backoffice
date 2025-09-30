import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-finance-page',
    templateUrl: './finance-page.component.html',
    styleUrls: ['./finance-page.component.scss'],
    standalone: false
})
export class FinancePageComponent implements OnInit {
  activeId: string;

  constructor(public route: ActivatedRoute, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Finance');
    this.route.params.subscribe((p) => {
      this.activeId = p.name || 'portfolio';
    });
  }
}
