import { UntypedFormGroup } from '@angular/forms';

export function MatchPasswordsValidator(controlName: string, matchingControlName: string) {
  return (formGroup: UntypedFormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmPasswordValidator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmPasswordValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
