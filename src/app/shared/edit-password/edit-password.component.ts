import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatchPasswordsValidator } from '@core/validators';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-password',
  templateUrl: './edit-password.component.html',
  styleUrls: ['./edit-password.component.scss'],
})
export class EditPasswordComponent implements OnInit {
  public editorForm: FormGroup;
  @Output()
  editPassword: EventEmitter<any> = new EventEmitter<any>();

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.editorForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MatchPasswordsValidator('password', 'confirmPassword'),
      }
    );
  }

  get password(): string {
    return this.editorForm.get('password').value;
  }

  get confirmPassword(): string {
    return this.editorForm.get('confirmPassword').value;
  }

  send() {
    this.editPassword.emit({
      password: this.password,
      confirmPassword: this.confirmPassword,
    });
    this.editorForm.reset();
  }
}
