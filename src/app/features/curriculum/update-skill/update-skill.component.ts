import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Skill } from '@core/models/curriculum';

@Component({
    selector: 'app-update-skill',
    templateUrl: './update-skill.component.html',
    styleUrls: ['./update-skill.component.scss'],
    standalone: false
})
export class UpdateSkillComponent implements OnInit {
  form: UntypedFormGroup;

  @Input()
  skill: Skill;

  @Output()
  skillSubmitted: EventEmitter<Skill> = new EventEmitter<Skill>();

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: UntypedFormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      name: new UntypedFormControl(this.skill?.name, [Validators.required]),
      priority: new UntypedFormControl(this.skill?.priority, [Validators.required]),
      tags: new UntypedFormControl(this.skill?.tags || [], [Validators.minLength(1)]),
      softSkill: new UntypedFormControl(this.skill?.softSkill || false, [Validators.required]),
    });
  }

  send() {
    this.skillSubmitted.emit({
      name: this.form.get('name').value,
      tags: this.form.get('tags').value,
      priority: this.form.get('priority').value,
      softSkill: this.form.get('softSkill').value,
      hardSkill: !this.form.get('softSkill').value,
    });
  }
}
