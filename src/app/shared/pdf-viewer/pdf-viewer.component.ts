import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FileUpload } from '@core/models/file-upload';
import { FileService } from '@core/service/file.service';
import { PdfService } from '@core/service/pdf.service';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { User } from '@core/models/user';

@Component({
    selector: 'app-pdf-viewer',
    templateUrl: './pdf-viewer.component.html',
    styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent implements OnInit {
    @Input()
    pdf: FileUpload;
    @Input()
    demoMode: boolean = false;
    @Input()
    showRotateBtn = true;
    @Input()
    asModal = true;
    @Input()
    title: string = '';
    pdfSrc: any;
    xml: any;
    user: User;
    get hasRoleAdmin(): boolean {
        return this.user.authorities.includes('ADMIN');
    }
    constructor(
        public activeModal: NgbActiveModal,
        private fileService: FileService,
        private pdfService: PdfService,
        private personalInfoService: PersonalInfoService,
    ) { }

    ngOnInit() {
        this.load();
    }

    load() {
        this.fileService
            .toDownloadLink(this.fileService.getDownloadUrl(this.pdf.id))
            .subscribe((link) => {
                this.pdfSrc = link.href;
                if (this.pdf.contentType === "text/xml" || this.pdf.contentType === "application/xml") {
                    this.asXML();
                }
            });
        this.personalInfoService.me().subscribe((u) => (this.user = u));
    }

    private async asXML() {
        const res = await fetch(this.pdfSrc);
        if (!res.ok) return 'Error';
        const blob = await res.blob();
        const xml = await blob.text();
        this.xml = xml;
    }
    get markdown() {
        if (!this.xml) {
            return null;
        }
        return "```xml\n" + this.xml + "\n```";
    }

    rotate(deg: number) {
        if (!this.hasRoleAdmin) {
            return;
        }
        this.pdfService.rotate(this.pdf.id, deg).subscribe((_) => this.load());
    }
}
