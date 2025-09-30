import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-pathfinder-manipulation',
    templateUrl: './pathfinder-manipulation.component.html',
    styleUrls: ['./pathfinder-manipulation.component.scss'],
    standalone: false
})
export class PathfinderManipulationComponent implements OnInit {
  activeId: string;

  constructor(public route: ActivatedRoute) {}

  ngOnInit(): void {
    this.activeId = this.route.snapshot.params.name || 'json-path';
  }
}
