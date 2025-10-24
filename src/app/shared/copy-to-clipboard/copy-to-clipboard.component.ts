import { Component, Input } from '@angular/core';
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
  @Input()
  successMessage: string = 'Copied';

  randomUuid() {
    return crypto.randomUUID();
  }
  constructor(private toastService: ToastService) {}

  copyToClipboard(e) {
    e.preventDefault();
    e.stopPropagation();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(this.textToCopy)
        .then(() => this.toastService.showSuccess(this.successMessage))
        .catch((error) => this.toastService.showDanger('error: ' + error.error));
    } else {
      this.toastService.showDanger('Clipboard api not available');
    }
  }
}
