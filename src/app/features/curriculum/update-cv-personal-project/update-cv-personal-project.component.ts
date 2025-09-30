import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { PersonalProject } from '@core/models/curriculum';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-update-cv-personal-project',
    templateUrl: './update-cv-personal-project.component.html',
    styleUrls: ['./update-cv-personal-project.component.scss'],
    standalone: false
})
export class UpdateCvPersonalProjectComponent implements OnInit {
  form: UntypedFormGroup;

  @Input()
  personalProject: PersonalProject;

  @Output()
  personalProjectUpdated: EventEmitter<PersonalProject> = new EventEmitter<PersonalProject>();

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: new UntypedFormControl(this.personalProject?.name, [Validators.required]),
      url: new UntypedFormControl(this.personalProject?.url, [Validators.required]),
      description: new UntypedFormControl(this.personalProject?.description, []),
    });
  }

  send() {
    const proj: PersonalProject = {
      name: this.form.controls.name.value,
      url: this.form.controls.url.value,
      description: this.form.controls.description.value,
    };
    this.personalProjectUpdated.emit(proj);
    this.form.reset();
  }
}
