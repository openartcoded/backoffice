import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';

export function EmailsValidator(controlName: string) {
  return (formGroup: UntypedFormGroup) => {
    let control = formGroup.controls[controlName];
    let emails: string[] | undefined | null = control?.value;

    if (emails) {
      for (const email of emails) {
        let fc = new FormControl(email, Validators.email);
        if (fc.errors) {
          return fc.errors;
        }
      }
      return null;
    } else {
      return { emailsRequired: 'at least one email is required' };
    }
  };
}
