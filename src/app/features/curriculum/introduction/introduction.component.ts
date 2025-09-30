import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-introduction',
    templateUrl: './introduction.component.html',
    styleUrls: ['./introduction.component.scss'],
    standalone: false
})
export class IntroductionComponent implements OnInit {
  @Input()
  introduction: string;

  @Output()
  onIntroductionUpdated: EventEmitter<string> = new EventEmitter<string>();

  form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      editing: new UntypedFormControl({ value: false, disabled: true }, []),
      intro: new UntypedFormControl(
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
    this.form.controls.intro.patchValue(this.introduction);
  }

  get intro(): string {
    return this.form.controls.intro.value;
  }

  submit() {
    this.onIntroductionUpdated.emit(this.intro);
    this.toggleEditing();
  }
}
