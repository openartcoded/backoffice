import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-date-manipulation',
  templateUrl: './date-manipulation.component.html',
  styleUrls: ['./date-manipulation.component.scss'],
})
export class DateManipulationComponent implements OnInit {
  activeId: string;

  constructor(public route: ActivatedRoute, private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Date duration calculator');
    this.metaService.updateTag({
      name: 'description',
      content: `Online date calculator`,
    });

    this.activeId = this.route.snapshot.params.name || 'business-days';
  }
}
