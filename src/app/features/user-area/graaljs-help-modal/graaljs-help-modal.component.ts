import { HttpClient } from '@angular/common/http';
import { Component, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-graaljs-help-modal',
  templateUrl: './graaljs-help-modal.component.html',
  styleUrl: './graaljs-help-modal.component.scss',
  standalone: false,
})
export class GraaljsHelpModalComponent {
  @ViewChild('helpModal') helpModal!: TemplateRef<any>;

  content: string;

  constructor(
    private modalService: NgbModal,
    private http: HttpClient,
  ) {}

  ngOnInit(): void {
    this.loadMarkdown();
  }

  private loadMarkdown(): void {
    this.http.get('assets/graaljs-help.md', { responseType: 'text' }).subscribe({
      next: (content) => (this.content = content),
      error: (err) => {
        console.error('Failed to load GraalJS help markdown:', err);
        this.content = '# Error\n\nFailed to load help content.';
      },
    });
  }

  open(): void {
    this.modalService.open(this.helpModal, {
      fullscreen: true,
      scrollable: true,
    });
  }
}
