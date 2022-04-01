import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Experience } from '@core/models/curriculum';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-update-experience',
  templateUrl: './update-experience.component.html',
  styleUrls: ['./update-experience.component.scss'],
})
export class UpdateExperienceComponent implements OnInit {
  form: FormGroup;

  @Input()
  experience: Experience;

  @Output()
  experienceSubmitted: EventEmitter<Experience> = new EventEmitter<Experience>();

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: new FormControl(this.experience?.title, [Validators.required]),
      company: new FormControl(this.experience?.company, [Validators.required]),
      current: new FormControl(this.experience?.current || false, [Validators.required]),
      from: new FormControl(DateUtils.formatInputDate(DateUtils.toDateOrNow(this.experience.from)), [
        Validators.required,
      ]),
      to: new FormControl(
        this.experience.to ? DateUtils.formatInputDate(DateUtils.toOptionalDate(this.experience.to)) : null,
        []
      ),
      description: this.fb.array((this.experience.description || []).map((d) => new FormControl(d, []))),
    });
  }

  get current(): boolean {
    return this.form.controls.current.value;
  }

  get description(): FormArray {
    return this.form.controls.description as FormArray;
  }

  add($event: MouseEvent) {
    $event.preventDefault();
    this.description.push(new FormControl('', []));
  }

  async delete($event: MouseEvent, i: number) {
    $event.preventDefault();
    this.description.removeAt(i);
  }

  send() {
    const exp: Experience = {
      description: this.description.controls.map((ctrl) => ctrl.value).filter((d) => d?.length && !/^\s*$/.test(d)),
      from: DateUtils.getDateFromInput(this.form.controls.from.value),
      to: this.current ? null : DateUtils.toOptionalDate(this.form.controls.to.value),
      title: this.form.controls.title.value,
      company: this.form.controls.company.value,
      current: this.current,
    };
    this.experienceSubmitted.emit(exp);
    this.form.reset();
  }
  moveUp($event, index: number) {
    $event.preventDefault();
    if (index > 0) {
      const descriptionFormArray = this.description as FormArray;
      const description = descriptionFormArray.value;
      const newDescription = this.swap(description, index - 1, index);
      descriptionFormArray.setValue(newDescription);
    }
  }

  moveDown($event, index: number) {
    $event.preventDefault();
    const descriptionFormArray = this.description as FormArray;
    const description = descriptionFormArray.value;
    if (index < description.length - 1) {
      const newDescription = this.swap(description, index, index + 1);
      descriptionFormArray.setValue(newDescription);
    }
  }
  swap(arr: any[], index1: number, index2: number): any[] {
    arr = [...arr];
    const temp = arr[index1];
    arr[index1] = arr[index2];
    arr[index2] = temp;
    return arr;
  }
}
