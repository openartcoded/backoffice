import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import QRCode from 'qrcode';
@Component({
    selector: 'app-qrcode',
    standalone: false,
    templateUrl: './qrcode.component.html',
    styleUrl: './qrcode.component.scss'
})
export class QrcodeComponent {
    data: FormControl<string> = new FormControl('');
    qrCodeUrl?: string;

    async generateQR() {
        try {
            if (!this.data.value) {
                return;
            }

            // Generate QR code as data URL
            this.qrCodeUrl = await QRCode.toDataURL(this.data.value, {
                width: 300,
                margin: 2,
                color: {
                    dark: '#000000',
                    light: '#FFFFFF'
                }
            });
        } catch (error) {
            console.error('Error generating QR code:', error);
            this.qrCodeUrl = undefined;
        }
    }
}
