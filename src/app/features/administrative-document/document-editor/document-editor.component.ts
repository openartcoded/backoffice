import { Component, EventEmitter, Input, OnInit, Optional } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal, NgbDropdownModule, NgbModal, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { FileSystemFileEntry, NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';
import { AdministrativeDocument, AdministrativeDocumentForm } from '@core/models/administrative-document';
import { FileService } from '@core/service/file.service';
import { FileUpload } from '@core/models/file-upload';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { User } from '@core/models/user';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AutosizeModule } from 'ngx-autosize';
import { SharedModule } from '@shared/shared.module';

@Component({
    selector: 'app-document-editor',
    templateUrl: './document-editor.component.html',
    styleUrls: ['./document-editor.component.scss'],
    standalone: true,
    imports: [NgbNavModule, NgxFileDropModule,
        SharedModule,
        RouterModule,
        NgbDropdownModule,
        FormsModule,
        CommonModule, NgbTooltipModule, FontAwesomeModule, ReactiveFormsModule, AutosizeModule]
})
export class DocumentEditorComponent implements OnInit {
    form: UntypedFormGroup;
    @Input()
    adminDoc: AdministrativeDocument;
    @Input()
    formDisabled = false;
    @Input()
    user: User;
    get hasRoleAdmin(): boolean {
        return this.user.authorities.includes('ADMIN');
    }
    formSubmitted: EventEmitter<AdministrativeDocumentForm> = new EventEmitter<AdministrativeDocumentForm>();

    constructor(
        private fb: UntypedFormBuilder,
        private fileService: FileService,
        private modalService: NgbModal,
        @Optional() public activeModal: NgbActiveModal,
    ) { }

    ngOnInit(): void {
        this.form = this.fb.group(
            {
                id: new UntypedFormControl({ disabled: true, value: this.adminDoc.id }, []),
                title: new UntypedFormControl(
                    { disabled: !this.hasRoleAdmin || this.formDisabled, value: this.adminDoc.title },
                    [Validators.required],
                ),
                description: new UntypedFormControl(
                    { disabled: !this.hasRoleAdmin || this.formDisabled, value: this.adminDoc.description },
                    [Validators.required],
                ),
                tags: new UntypedFormControl(
                    { disabled: !this.hasRoleAdmin || this.formDisabled, value: this.adminDoc.tags || [] },
                    [],
                ),

                document: new UntypedFormControl({ disabled: !this.hasRoleAdmin || this.formDisabled, value: null }, []),
            },
            {},
        );
    }

    download(upl: FileUpload) {
        this.fileService.download(upl);
    }

    openPdfViewer(a: FileUpload) {
        let ngbModalRef = this.modalService.open(PdfViewerComponent, {
            size: 'xl',
            scrollable: true,
        });
        ngbModalRef.componentInstance.pdf = a;
        ngbModalRef.componentInstance.title = a?.originalFilename;
    }

    openImageViewer(a: FileUpload) {
        let ngbModalRef = this.modalService.open(ImageViewerComponent, {
            size: 'xl',
            scrollable: true,
        });
        ngbModalRef.componentInstance.image = a;
        ngbModalRef.componentInstance.title = a?.originalFilename;
    }

    isPdf(upl: FileUpload) {
        return FileService.isPdf(upl?.contentType);
    }

    isImage(upl: FileUpload) {
        return FileService.isImage(upl?.contentType);
    }
    get document(): File {
        return this.form.get('document').value;
    }

    set document(fs: File) {
        if (!this.hasRoleAdmin) {
            return;
        }
        this.form.get('document').patchValue(fs);
    }

    drop(files: NgxFileDropEntry[]) {
        if (!this.hasRoleAdmin) {
            return;
        }
        for (const droppedFile of files) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
                this.document = file;
                this.form.updateValueAndValidity();
            });
        }
    }

    submit() {
        if (!this.hasRoleAdmin) {
            return;
        }
        const submitForm = {
            title: this.form.get('title').value,
            id: this.form.get('id').value,
            description: this.form.get('description').value,
            tags: this.form.get('tags').value,
            document: this.document,
        };
        this.formSubmitted.emit(submitForm);
        this.form.reset();
    }
}
