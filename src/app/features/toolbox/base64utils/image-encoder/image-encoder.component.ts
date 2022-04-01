import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-image-encoder',
  templateUrl: './image-encoder.component.html',
  styleUrls: ['./image-encoder.component.scss'],
})
export class ImageEncoderComponent implements OnInit {
  base64Form: FormGroup;
  result: string;

  constructor(private fb: FormBuilder, private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    this.titleService.setTitle('Image to BASE64 conversion');
    this.metaService.updateTag({
      name: 'description',
      content: `Online Image to Base64 converter`,
    });

    this.base64Form = this.fb.group(
      {
        fileImage: new FormControl('', [Validators.required]),
      },
      {}
    );
  }

  get fileImage(): File {
    return this.base64Form.get('fileImage').value;
  }

  set fileImage(file: File) {
    this.base64Form.get('fileImage').patchValue(file);
  }

  drop($event: NgxFileDropEntry[]) {
    for (const droppedFile of $event) {
      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
      fileEntry.file((file: File) => {
        this.fileImage = file;
      });
    }
  }

  submit() {
    this.result = null;
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(this.fileImage);
    reader.onload = (): void => {
      this.result = reader.result as string;
    };
  }
}
