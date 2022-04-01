import { Component, OnInit } from '@angular/core';
import { CvService } from '@core/service/cv.service';
import { Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { FileService } from '@core/service/file.service';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-cv-editor',
  templateUrl: './cv-editor.component.html',
  styleUrls: ['./cv-editor.component.scss'],
})
export class CvEditorComponent implements OnInit {
  editedCv: any;
  file: any;

  constructor(
    private cvService: CvService,
    private fileService: FileService,
    private titleService: Title,
    private router: Router
  ) {}

  get cv() {
    return this.editedCv;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Cv Editor');
    this.cvService.getFullCurriculum().subscribe((data) => {
      let code = JSON.stringify(data, null, 2);
      this.editedCv = code;
    });
  }

  save() {
    let cv = JSON.parse(this.editedCv);
    this.cvService.updateCurriculum(cv).subscribe((data) => {
      this.editedCv = null;
      this.router.navigateByUrl('cv');
    });
  }

  download() {
    this.fileService.createFile(this.editedCv, 'cv' + DateUtils.getCurrentTime() + '.json', 'application/json');
  }

  import() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.editedCv = fileReader.result;
      this.save();
    };
    fileReader.readAsText(this.file);
  }

  load($event) {
    this.file = $event.target.files[0];
  }
}
