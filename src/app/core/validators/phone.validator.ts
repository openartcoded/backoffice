import { UntypedFormGroup } from '@angular/forms';
import isMobilePhone from 'validator/es/lib/isMobilePhone';

export function PhoneValidator(controlName: string) {
  return (formGroup: UntypedFormGroup) => {
    let control = formGroup.controls[controlName];
    let phone: string | undefined | null = control?.value;

    if (phone) {
      if (!isMobilePhone(phone, ['fr-BE', 'nl-BE', 'fr-FR', 'nl-NL'])) {
        return { invalidPhone: 'not a mobile phone' };
      }
      return null;
    } else {
      return { phoneRequired: 'at least one email is required' };
    }
  };
}
