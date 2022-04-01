import { Component, EventEmitter, Input, OnDestroy, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UploadResult } from 'ngx-markdown-editor';
import { FileService } from '@core/service/file.service';
import { map } from 'rxjs/operators';
import { Post } from '@core/models/post';
import { BlogService } from '@core/service/blog.service';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-post-editor',
  templateUrl: './post-editor.component.html',
  styleUrls: ['./post-editor.component.scss'],
})
export class PostEditorComponent implements OnInit, OnDestroy {
  @Input()
  post: Post;
  @Output()
  saved: EventEmitter<Post> = new EventEmitter<Post>();
  autosave: Subscription;

  public editorForm: FormGroup;
  url: any;

  constructor(
    private formBuilder: FormBuilder,
    private blogService: BlogService,
    private fileService: FileService,
    @Optional() public activeModal: NgbActiveModal
  ) {
    this.doUpload = this.doUpload.bind(this); // This is very important.
  }

  doUpload(files: FileList): Promise<Array<UploadResult>> {
    return this.fileService
      .uploadFileList(files, true, this.post.id)
      .pipe(
        map((upload) => {
          let type = upload.metadata.contentType.split('/')[0];
          let isImg = type.toLowerCase().includes('image');
          return [
            {
              name: upload.metadata.originalFilename,
              url: this.fileService.getPublicDownloadUrl(upload.id),
              isImg: isImg,
            } as UploadResult,
          ];
        })
      )
      .toPromise();
  }

  ngOnInit(): void {
    this.editorForm = this.createFormGroup(this.post);
    const secondsCounter = interval(20000);
    this.autosave = secondsCounter.subscribe((n) => this.save());
  }

  get htmlContent() {
    return this.editorForm.get('htmlContent');
  }

  get title() {
    return this.editorForm.get('title');
  }

  createFormGroup(post: Post): FormGroup {
    if (post.coverId) {
      this.url = this.fileService.getPublicDownloadUrl(post.coverId);
    }
    return this.formBuilder.group({
      htmlContent: new FormControl(post.content, [Validators.required]),
      title: new FormControl(post.title, [Validators.required]),
      description: new FormControl(post.description, [Validators.required]),
      id: new FormControl(post.id, [Validators.required]),
      tags: new FormControl(post.tags || [], []),
      draft: new FormControl(true, []),
      cover: new FormControl(null, []),
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
    }
  ) {
    let formData = new FormData();
    formData.append('id', this.post.id);
    formData.append('content', this.htmlContent.value);
    formData.append('tags', this.editorForm.get('tags').value);
    formData.append('draft', this.editorForm.get('draft').value);
    formData.append('title', this.title.value);
    formData.append('cover', this.cover);
    formData.append('description', this.editorForm.get('description').value);
    this.blogService.save(formData).subscribe(callback);
  }

  send() {
    this.save((data) => {
      this.editorForm.reset();
      this.saved.emit(data);
      this.activeModal?.close();
    });
  }

  ngOnDestroy(): void {
    this.autosave.unsubscribe();
  }
}
