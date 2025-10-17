import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-rdf-manipulation',
  templateUrl: './rdf-manipulation.component.html',
  styleUrls: ['./rdf-manipulation.component.scss'],
  standalone: false,
})
export class RdfManipulationComponent implements OnInit {
  activeId: string;

  constructor(
    public route: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle(
      'Resource Description Framework (RDF) tools, rdf to json, rdf to json-ld, rdf to trig, rdf to turtle',
    );
    this.metaService.updateTag({
      name: 'description',
      content: `Resource description framework online tools`,
    });

    this.activeId = this.route.snapshot.params.name || 'file-conversion';
  }
}
