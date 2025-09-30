import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Hobby } from '@core/models/curriculum';

@Component({
    selector: 'app-update-hobby',
    templateUrl: './update-hobby.component.html',
    styleUrls: ['./update-hobby.component.scss'],
    standalone: false
})
export class UpdateHobbyComponent implements OnInit {
  form: UntypedFormGroup;

  @Input()
  hobbies: Hobby[];

  @Output()
  hobbiesSubmitted: EventEmitter<Hobby[]> = new EventEmitter<Hobby[]>();

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      hobbiesArray: this.fb.array((this.hobbies || []).map((d) => new UntypedFormControl(d.title, []))),
    });
  }

  get hobbiesArray(): UntypedFormArray {
    return this.form.controls.hobbiesArray as UntypedFormArray;
  }

  add($event: MouseEvent) {
    $event.preventDefault();
    this.hobbiesArray.push(new UntypedFormControl('', []));
  }

  async delete($event: MouseEvent, i: number) {
    $event.preventDefault();
    this.hobbiesArray.removeAt(i);
  }

  send() {
    const newHobbies = this.hobbiesArray.controls.map((ctrl) => {
      return {
        title: ctrl.value,
      };
    });
    this.hobbiesSubmitted.emit(newHobbies);
    this.form.reset();
  }
}
