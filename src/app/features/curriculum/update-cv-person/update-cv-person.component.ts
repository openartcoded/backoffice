import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Person } from '@core/models/curriculum';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-update-cv-person',
  templateUrl: './update-cv-person.component.html',
  styleUrls: ['./update-cv-person.component.scss'],
})
export class UpdateCvPersonComponent implements OnInit {
  form: FormGroup;

  @Input()
  person: Person;

  @Output()
  personUpdated: EventEmitter<Person> = new EventEmitter<Person>();

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      editing: new FormControl({ value: false, disabled: true }, []),
      address: new FormControl(
        {
          value: this.person.address,
          disabled: false,
        },
        [Validators.required]
      ),
      emailAddress: new FormControl(
        {
          value: this.person.emailAddress,
          disabled: false,
        },
        [Validators.required, Validators.email]
      ),
      firstname: new FormControl(
        {
          value: this.person.firstname,
          disabled: false,
        },
        [Validators.required]
      ),
      lastname: new FormControl(
        {
          value: this.person.lastname,
          disabled: false,
        },
        [Validators.required]
      ),
      title: new FormControl(
        {
          value: this.person.title,
          disabled: false,
        },
        [Validators.required]
      ),
      githubUrl: new FormControl(
        {
          value: this.person.githubUrl,
          disabled: false,
        },
        [Validators.required]
      ),
      linkedinUrl: new FormControl(
        {
          value: this.person.linkedinUrl,
          disabled: false,
        },
        [Validators.required]
      ),
      website: new FormControl(
        {
          value: this.person.website,
          disabled: false,
        },
        []
      ),
      phoneNumber: new FormControl(
        {
          value: this.person.phoneNumber,
          disabled: false,
        },
        [Validators.required]
      ),
      birthdate: new FormControl(
        {
          value: DateUtils.formatInputDate(DateUtils.toDateOrNow(this.person.birthdate)),
          disabled: false,
        },
        [Validators.required]
      ),
    });
  }

  submit() {
    let person: Person = {
      birthdate: DateUtils.getDateFromInput(this.form.controls.birthdate.value),
      phoneNumber: this.form.controls.phoneNumber.value,
      linkedinUrl: this.form.controls.linkedinUrl.value,
      lastname: this.form.controls.lastname.value,
      githubUrl: this.form.controls.githubUrl.value,
      title: this.form.controls.title.value,
      address: this.form.controls.address.value,
      emailAddress: this.form.controls.emailAddress.value,
      firstname: this.form.controls.firstname.value,
      website: this.form.controls.website.value,
    };
    this.personUpdated.emit(person);
  }
}
