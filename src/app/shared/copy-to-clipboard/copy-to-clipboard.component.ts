import { Component, Inject, Input } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WindowRefService } from '@core/service/window.service';


@Component({
    selector: 'app-copy-to-clipboard',
    templateUrl: './copy-to-clipboard.component.html',
    styleUrl: './copy-to-clipboard.component.scss',
    standalone: false
})
export class CopyToClipboardComponent {
    @Input()
    btnClasses = "btn btn-outline-secondary";
    @Input()
    textToCopy?: string;

    constructor(@Inject(DOCUMENT) private document: Document, private windowRefService: WindowRefService) { }

    copyToClipboard(e) {
        e.preventDefault();
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(this.textToCopy).then(() => this.windowRefService.nativeWindow.alert('Copied')).catch((error) => this.windowRefService.nativeWindow.alert('error: ' + error.error));
        } else {
            this.windowRefService.nativeWindow.alert('Clipboard api not available');
        }
    }

}

