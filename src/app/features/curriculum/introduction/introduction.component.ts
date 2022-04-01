import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-introduction',
  templateUrl: './introduction.component.html',
  styleUrls: ['./introduction.component.scss'],
})
export class IntroductionComponent implements OnInit {
  @Input()
  introduction: string;

  @Output()
  onIntroductionUpdated: EventEmitter<string> = new EventEmitter<string>();

  form: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      editing: new FormControl({ value: false, disabled: true }, []),
      intro: new FormControl(
        {
          value: this.introduction,
          disabled: false,
        },
        [Validators.required, Validators.minLength(5)]
      ),
    });
  }

  get editing(): boolean {
    return this.form.controls.editing.value;
  }

  toggleEditing() {
    this.form.controls.editing.patchValue(!this.editing);
  }

  get intro(): string {
    return this.form.controls.intro.value;
  }

  submit() {
    this.onIntroductionUpdated.emit(this.intro);
    this.toggleEditing();
  }
}
