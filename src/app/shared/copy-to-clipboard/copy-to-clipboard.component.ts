import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';
import { ToastService } from '@core/service/toast.service';

@Component({
  selector: 'app-copy-to-clipboard',
  templateUrl: './copy-to-clipboard.component.html',
  styleUrl: './copy-to-clipboard.component.scss',
  standalone: false,
})
export class CopyToClipboardComponent {
  @Input()
  btnClasses = 'btn btn-outline-secondary';
  @Input()
  textToCopy?: string;

  @Input()
  label: string = 'Copy';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private windowRefService: WindowRefService,
    private toastService: ToastService,
  ) {}

  copyToClipboard(e) {
    e.preventDefault();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(this.textToCopy)
        .then(() => this.toastService.showSuccess('Copied'))
        .catch((error) => this.toastService.showDanger('error: ' + error.error));
    } else {
      this.toastService.showDanger('Clipboard api not available');
    }
  }
}
