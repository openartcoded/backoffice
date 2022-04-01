import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-invoice-page',
  templateUrl: './invoice-page.component.html',
  styleUrls: ['./invoice-page.component.scss'],
})
export class InvoicePageComponent implements OnInit {
  activeId: string;
  fullScreen: boolean;

  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (!this.modalService.hasOpenModals()) {
      this.fullScreen = false;
    }
  }

  constructor(public route: ActivatedRoute, private modalService: NgbModal, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Invoices');
    this.activeId = this.route.snapshot.params.name || 'unprocessed';
  }
}
