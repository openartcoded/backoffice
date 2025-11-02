import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { UploadResult } from 'ngx-markdown-editor';
import { FileService } from '@core/service/file.service';
import { map, skip } from 'rxjs/operators';
import { Post } from '@core/models/post';
import { ReportService } from '@core/service/report.service';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { firstValueFrom, interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '@core/service/toast.service';
import Prism from 'prismjs';
import { FileUpload } from '@core/models/file-upload';
import { PdfViewerComponent } from '@shared/pdf-viewer/pdf-viewer.component';
import { ImageViewerComponent } from '@shared/image-viewer/image-viewer.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss'],
  standalone: false,
})
export class PostEditorComponent implements OnInit, OnDestroy, AfterViewChecked {
  private lastState: any = null;
  deleteAttachment($event, f: FileUpload) {
    $event.preventDefault();
    this.reportService.removeAttachment(this.post.id, f.id).subscribe((p) => {
      this.post.attachmentIds = p.attachmentIds;
      this.reloadAttachments();
      this.toastService.showSuccess('Attachment removed');
    });
  }
  post: Post;
  uploading = false;
  saving = false;
  selectedFiles?: File[] = [];

  autosave: Subscription;
  @ViewChild('editor') editor!: ElementRef<HTMLTextAreaElement>;
  public editorForm: UntypedFormGroup;
  url: any;
  insertTable() {
    const textarea = this.editor.nativeElement;
    const tableTemplate = `
| Header 1 | Header 2 | Header 3 |
|----------|----------|----------|
| Row1Col1 | Row1Col2 | Row1Col3 |
| Row2Col1 | Row2Col2 | Row2Col3 |
`;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    textarea.value = text.substring(0, start) + tableTemplate + text.substring(end);

    const cursorPos = start + tableTemplate.length;
    textarea.setSelectionRange(cursorPos, cursorPos);
    textarea.focus();
  }
  wrapSelection(before: string, after: string = '') {
    const textarea = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = this.htmlContent?.value || '';
    const selectedText = currentValue.slice(start, end);

    const newValue = currentValue.slice(0, start) + before + selectedText + after + currentValue.slice(end);
    this.htmlContent?.patchValue(newValue);

    setTimeout(() => {
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = end + before.length;
      textarea.focus();
    });
  }

  insertLink() {
    const textarea = this.editor.nativeElement;
    const linkTemplate = `[Link Text](https://example.com)`;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = textarea.value;

    // Insert link at cursor
    textarea.value = text.substring(0, start) + linkTemplate + text.substring(end);

    // Move cursor inside the brackets for easier editing
    const cursorPos = start + 1;
    textarea.setSelectionRange(cursorPos, cursorPos + 9); // selects "Link Text"
    textarea.focus();
  }
  insertAtCursor(text: string) {
    const textarea = this.editor.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const currentValue = this.htmlContent?.value || '';

    const newValue = currentValue.slice(0, start) + text + currentValue.slice(end);
    this.htmlContent?.patchValue(newValue);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + text.length;
      textarea.focus();
    });
  }
  constructor(
    private formBuilder: UntypedFormBuilder,
    private reportService: ReportService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute,
    private fileService: FileService,
  ) {
    this.doUpload = this.doUpload.bind(this); // This is very important.
  }
  ngAfterViewChecked() {
    Prism.highlightAll();
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

  async reloadAttachments() {
    let attachments = [];
    if (!this.post.attachments) {
      this.post.attachments = [];
    }
    if (this.post.attachmentIds?.length) {
      attachments = await firstValueFrom(this.fileService.findByIds(this.post.attachmentIds));
    }
    for (const a of attachments) {
      if (a.thumbnailId) {
        a.transientThumbnail = await firstValueFrom(this.fileService.findById(a.thumbnailId));
      }
    }
    this.post.attachments = attachments;
  }
  async ngOnInit() {
    const id = this.activateRoute.snapshot.params.id;
    if (id) this.post = await firstValueFrom(this.reportService.getPostById(id));
    else this.post = await firstValueFrom(this.reportService.newPost());
    this.reloadAttachments();
    this.editorForm = this.createFormGroup(this.post);
    const secondsCounter = interval(10000).pipe(skip(1));
    this.lastState = JSON.stringify({
      id: this.post.id,
      content: this.htmlContent.value,
      author: this.editorForm.get('author').value,
      tags: this.editorForm.get('tags').value,
      draft: this.editorForm.get('draft').value,
      title: this.title.value,
      cover: this.cover,
      description: this.editorForm.get('description').value,
    });
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
      draft: new UntypedFormControl(post.draft, []),
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

  async save(
    callback = (args: any) => {
      console.log('saving...');
    },
  ) {
    let formData = new FormData();
    let oldState = {
      id: this.post.id,
      content: this.htmlContent.value,
      author: this.editorForm.get('author').value,
      tags: this.editorForm.get('tags').value,
      draft: this.editorForm.get('draft').value,
      title: this.title.value,
      cover: this.cover,
      description: this.editorForm.get('description').value,
    };
    formData.append('id', this.post.id);
    formData.append('content', this.htmlContent.value);
    formData.append('author', this.editorForm.get('author').value);
    formData.append('tags', this.editorForm.get('tags').value);
    formData.append('draft', this.editorForm.get('draft').value);
    formData.append('title', this.title.value);
    formData.append('cover', this.cover);
    formData.append('description', this.editorForm.get('description').value);
    let formDataJson = JSON.stringify(oldState);
    if (formDataJson === this.lastState) {
      return;
    }
    let res = await firstValueFrom(this.reportService.save(formData));
    callback(res);
    this.lastState = formDataJson;
    this.toastService.showSuccess('Report saved');
  }

  send() {
    this.save(() => {
      // this.editorForm.reset();
    });
  }

  ngOnDestroy(): void {
    this.autosave.unsubscribe();
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFiles = Array.from(input.files);
    }
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
  isXML(upl: FileUpload) {
    return FileService.isXML(upl?.contentType);
  }
  isImage(upl: FileUpload) {
    return FileService.isImage(upl?.contentType);
  }
  download(upl: FileUpload) {
    this.fileService.download(upl);
  }

  uploadAttachment() {
    if (!this.post?.id || !this.selectedFiles?.length) return;
    this.uploading = true;

    this.reportService.addAttachment(this.post.id, this.selectedFiles).subscribe({
      next: (p: Post) => {
        this.post.attachmentIds = p.attachmentIds;
        this.reloadAttachments();
        this.toastService.showSuccess('Attachment uploaded');
        this.selectedFiles = [];
      },
      error: () => this.toastService.showDanger('Upload failed'),
      complete: () => (this.uploading = false),
    });
  }
}
