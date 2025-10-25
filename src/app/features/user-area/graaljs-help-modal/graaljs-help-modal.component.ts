import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-graaljs-help-modal',
  templateUrl: './graaljs-help-modal.component.html',
  styleUrl: './graaljs-help-modal.component.scss',
  standalone: false,
})
export class GraaljsHelpModalComponent {
  @ViewChild('helpModal') helpModal!: TemplateRef<any>;

  markdownControl = new FormControl('');
  private modalRef?: NgbModalRef;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadMarkdown();
  }

  private loadMarkdown(): void {
    this.http.get('assets/graaljs-help.md', { responseType: 'text' }).subscribe({
      next: (content) => this.markdownControl.setValue(content),
      error: (err) => {
        console.error('Failed to load GraalJS help markdown:', err);
        this.markdownControl.setValue('# Error\n\nFailed to load help content.');
      },
    });
  }

  open(): void {
    this.modalRef = this.modalService.open(this.helpModal, {
      fullscreen: true,
      scrollable: true,
    });
  }
}
