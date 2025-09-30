import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-base64-manipulation',
    templateUrl: './base64-manipulation.component.html',
    styleUrls: ['./base64-manipulation.component.scss'],
    standalone: false
})
export class Base64ManipulationComponent implements OnInit {
  activeId: string;

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeId = this.route.snapshot.params.name || 'decode';
  }
}
