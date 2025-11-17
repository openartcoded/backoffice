import { AfterViewChecked, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { FileService } from '@core/service/file.service';
import { map, skip } from 'rxjs/operators';
import { Channel, getDueDateEmoji, Post, PostStatus } from '@core/models/post';
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
import { DomSanitizer } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { SlugifyPipe } from '@core/pipe/slugify-pipe';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { DateUtils } from '@core/utils/date-utils';
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
  getDueDateStatusLine = getDueDateEmoji;
  post: Post;
  uploading = false;
  saving = false;
  selectedFiles?: File[] = [];

  channel: Channel;
  user: User;
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

  onMarkdownChange(event: string) {
    console.log('change', event);
    this.htmlContent.patchValue(event);
  }
  constructor(
    private formBuilder: UntypedFormBuilder,
    private personalInfoService: PersonalInfoService,
    private location: Location,
    private reportService: ReportService,
    private toastService: ToastService,
    private modalService: NgbModal,
    private activateRoute: ActivatedRoute,
    private fileService: FileService,
    private domSanitizationService: DomSanitizer,
  ) {}
  ngAfterViewChecked() {
    Prism.highlightAll();
  }

  async reloadAttachments() {
    let attachments = [];
    if (!this.post.attachments) {
      this.post.attachments = [];
    }
    if (this.post.attachmentIds?.length) {
      attachments = await firstValueFrom(this.fileService.findByIds(this.post.attachmentIds));
    }
    // this could be refactored 2025-11-09 11:34
    const thumbs = attachments
      .map((u) => u.thumbnailId)
      .filter((u) => u?.length)
      .map((id) => {
        return { id } as FileUpload;
      });
    for (const upload of attachments) {
      if (upload.thumbnailId?.length) {
        const thumb = thumbs.find((t) => upload.thumbnailId === t.id);
        upload.transientThumbnail = thumb;
      }
    }
    this.post.attachments = attachments;
  }

  updateChannel(c: Channel) {
    this.channel = c;
  }
  get unReadMessagesCount() {
    return this.channel?.messages?.filter((m) => m.emailFrom !== this.user.email && !m.read)?.length || 0;
  }
  async ngOnInit() {
    const id = this.activateRoute.snapshot.params.id;
    if (id) this.post = await firstValueFrom(this.reportService.getPostById(id));
    else {
      this.post = await firstValueFrom(this.reportService.newPost());
      this.location.replaceState(`/report/post/${new SlugifyPipe().transform(this.post.title)}/${this.post.id}/edit`);
    }

    this.user = await firstValueFrom(this.personalInfoService.me());
    let channel = await firstValueFrom(this.reportService.getChannel(this.post.id));
    if (!channel?.subscribers.includes(this.user.email)) {
      channel = await firstValueFrom(this.reportService.subscribe(this.post.id));
    }
    this.channel = channel;
    this.reloadAttachments();
    this.editorForm = await this.createFormGroup(this.post);
    const secondsCounter = interval(60000).pipe(skip(1));
    this.lastState = JSON.stringify({
      id: this.post.id,
      content: this.htmlContent.value,
      author: this.editorForm.get('author').value,
      tags: this.editorForm.get('tags').value,
      status: this.editorForm.get('status').value,
      priority: this.editorForm.get('priority').value,
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
  private async loadCover(post: Post) {
    if (post.coverId) {
      const link = await firstValueFrom(this.fileService.toDownloadLink(this.fileService.getDownloadUrl(post.coverId)));
      this.url = this.domSanitizationService.bypassSecurityTrustUrl(link.href);
    }
  }

  async downloadBulk(attachments: FileUpload[]) {
    await this.fileService.downloadBulk(attachments.map((a) => a.id));
  }
  async createFormGroup(post: Post) {
    await this.loadCover(post);

    const dueDate = DateUtils.toOptionalDate(this.post?.dueDate);
    const dueDateFormatted = dueDate ? DateUtils.formatInputDateTime(dueDate) : null;
    return this.formBuilder.group({
      htmlContent: new UntypedFormControl(post.content, [Validators.required]),
      author: new UntypedFormControl(post.author, [Validators.required]),
      title: new UntypedFormControl(post.title, [Validators.required]),
      description: new UntypedFormControl(post.description, [Validators.required]),
      id: new UntypedFormControl(post.id, [Validators.required]),
      tags: new UntypedFormControl(post.tags || [], []),
      dueDate: new UntypedFormControl(
        {
          value: dueDateFormatted,
          disabled: false,
        },
        [],
      ),
      status: new UntypedFormControl(post.status, []),
      priority: new UntypedFormControl(post.priority, []),
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
    if (!this.editorForm.valid) {
      return;
    }
    const dueDate = this.editorForm.get('dueDate').value;

    let formData = new FormData();
    let oldState = {
      id: this.post.id,
      dueDate,
      content: this.htmlContent.value,
      author: this.editorForm.get('author').value,
      priority: this.editorForm.get('priority').value,
      tags: this.editorForm.get('tags').value,
      status: this.editorForm.get('status').value,
      title: this.title.value,
      cover: this.cover,
      description: this.editorForm.get('description').value,
    };
    formData.append('id', this.post.id);
    formData.append('dueDate', new Date(dueDate).toUTCString());
    formData.append('content', this.htmlContent.value);
    formData.append('author', this.editorForm.get('author').value);
    formData.append('tags', this.editorForm.get('tags').value);
    formData.append('status', this.editorForm.get('status').value);
    formData.append('priority', this.editorForm.get('priority').value);
    formData.append('title', this.title.value);
    formData.append('cover', this.cover);
    formData.append('description', this.editorForm.get('description').value);
    let formDataJson = JSON.stringify(oldState);
    if (formDataJson === this.lastState) {
      return;
    }
    let res = await firstValueFrom(this.reportService.save(formData));
    callback(res);
    this.post = res;
    this.lastState = formDataJson;
    await this.reloadAttachments();
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
  isProcessed(a: FileUpload) {
    return this.post.processedAttachmentIds?.includes(a.id);
  }
  toggleAttachmentProcess(a: FileUpload) {
    this.reportService.toggleProcessAttachment(this.post.id, a.id).subscribe({
      next: (p: Post) => {
        this.toastService.showSuccess(
          this.post.processedAttachmentIds?.includes(a.id) ? 'Attachment unprocessed' : 'Attachment processed',
        );
        this.post.attachmentIds = p.attachmentIds;
        this.post.processedAttachmentIds = p.processedAttachmentIds;
        this.reloadAttachments();
      },
      error: () => this.toastService.showDanger('Failed to toggle attachment state'),
    });
  }
  uploadAttachment() {
    if (!this.post?.id || !this.selectedFiles?.length) return;
    this.uploading = true;

    this.reportService.addAttachment(this.post.id, this.selectedFiles).subscribe({
      next: (p: Post) => {
        this.post.attachmentIds = p.attachmentIds;
        this.reloadAttachments();
        this.toastService.showSuccess('Attachments uploaded');
        this.selectedFiles = [];
      },
      error: () => {
        this.toastService.showDanger('Failed to upload attachments. Try with less');

        this.selectedFiles = [];
        this.uploading = false;
      },

      complete: () => (this.uploading = false),
    });
  }
}
