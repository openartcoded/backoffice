import { FormGroup } from '@angular/forms';

export function MultiFileLengthValidator(controlName: string, minFileLength: number) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];
    let files: File[] = control.value;
    if (control.errors && !control.errors.filesLength) {
      return;
    }
    if (files?.length < minFileLength) {
      control.setErrors({ filesLength: true });
    } else {
      control.setErrors(null);
    }
  };
}
