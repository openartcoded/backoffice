import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-edit-email',
  templateUrl: './edit-email.component.html',
  styleUrls: ['./edit-email.component.scss'],
})
export class EditEmailComponent implements OnInit {
  public editorForm: FormGroup;

  @Input()
  currentEmail: string;

  @Output()
  editEmail: EventEmitter<string> = new EventEmitter<string>();

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {}

  ngOnInit(): void {
    this.editorForm = this.fb.group({
      email: [this.currentEmail, [Validators.required, Validators.email]],
    });
  }

  get email(): string {
    return this.editorForm.get('email').value;
  }

  send() {
    this.editEmail.emit(this.email);
    this.editorForm.reset();
  }
}
