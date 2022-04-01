import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-dossier-page',
  templateUrl: './dossier-page.component.html',
  styleUrls: ['./dossier-page.component.scss'],
})
export class DossierPageComponent implements OnInit {
  activeId: string;

  constructor(public route: ActivatedRoute, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Dossiers');
    this.activeId = this.route.snapshot.params.name || 'open';
  }
}
