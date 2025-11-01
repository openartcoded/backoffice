import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UploadResult } from 'ngx-markdown-editor';
import { FileService } from '@core/service/file.service';
import { map } from 'rxjs/operators';
import { Post } from '@core/models/post';
import { ReportService } from '@core/service/report.service';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { firstValueFrom, interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '@core/service/toast.service';

@Component({
    selector: 'app-post-editor',
    templateUrl: './post-editor.component.html',
    styleUrls: ['./post-editor.component.scss'],
    standalone: false,
})
export class PostEditorComponent implements OnInit, OnDestroy {
    post: Post;
    autosave: Subscription;

    public editorForm: UntypedFormGroup;
    url: any;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private reportService: ReportService,
        private toastService: ToastService,
        private activateRoute: ActivatedRoute,
        private fileService: FileService,
    ) {
        this.doUpload = this.doUpload.bind(this); // This is very important.
    }

    doUpload(files: FileList): Promise<Array<UploadResult>> {
        return firstValueFrom(
            this.fileService.uploadFileList(files, true, this.post.id).pipe(
                map((upload) => {
                    let type = upload?.contentType.split('/')[0];
                    let isImg = type.toLowerCase().includes('image');
                    return [
                        {
                            name: upload?.originalFilename,
                            url: this.fileService.getPublicDownloadUrl(upload.id),
                            isImg: isImg,
                        } as UploadResult,
                    ];
                }),
            ),
        );
    }

    async ngOnInit() {
        const id = this.activateRoute.snapshot.params.id;
        if (id)
            this.post = await firstValueFrom(this.reportService.getPostById(id));
        else
            this.post = await firstValueFrom(this.reportService.newPost());
        this.editorForm = this.createFormGroup(this.post);
        const secondsCounter = interval(20000);
        this.autosave = secondsCounter.subscribe((_) => this.save());
    }

    get htmlContent() {
        return this.editorForm.get('htmlContent');
    }

    get title() {
        return this.editorForm.get('title');
    }

    createFormGroup(post: Post): UntypedFormGroup {
        if (post.coverId) {
            this.url = this.fileService.getPublicDownloadUrl(post.coverId);
        }
        return this.formBuilder.group({
            htmlContent: new UntypedFormControl(post.content, [Validators.required]),
            author: new UntypedFormControl(post.author, [Validators.required]),
            title: new UntypedFormControl(post.title, [Validators.required]),
            description: new UntypedFormControl(post.description, [Validators.required]),
            id: new UntypedFormControl(post.id, [Validators.required]),
            tags: new UntypedFormControl(post.tags || [], []),
            draft: new UntypedFormControl(true, []),
            cover: new UntypedFormControl(null, []),
        });
    }

    get cover(): File {
        return this.editorForm.get('cover').value;
    }

    set cover(file: File) {
        this.editorForm.get('cover').patchValue(file);
    }

    drop($event: NgxFileDropEntry[]) {
        for (const droppedFile of $event) {
            const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
            fileEntry.file((file: File) => {
                this.cover = file;
                let reader = new FileReader();
                reader.onload = (event: any) => {
                    this.url = event.target.result;
                };
                reader.onerror = (event: any) => {
                    console.log('File could not be read: ' + event.target.error.code);
                };
                reader.readAsDataURL(file);
            });
        }
    }

    save(
        callback = (data) => {
            console.log('saving...');
        },
    ) {
        let formData = new FormData();
        formData.append('id', this.post.id);
        formData.append('content', this.htmlContent.value);
        formData.append('author', this.editorForm.get('author').value);
        formData.append('tags', this.editorForm.get('tags').value);
        formData.append('draft', this.editorForm.get('draft').value);
        formData.append('title', this.title.value);
        formData.append('cover', this.cover);
        formData.append('description', this.editorForm.get('description').value);
        this.reportService.save(formData).subscribe(callback);
        this.toastService.showSuccess("Report saved");
    }

    send() {
        this.save((data) => {
            this.editorForm.reset();
        });
    }

    ngOnDestroy(): void {
        this.autosave.unsubscribe();
    }
}
