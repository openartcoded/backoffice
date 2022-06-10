import { UntypedFormGroup } from '@angular/forms';

export function PasswordValidator(group: UntypedFormGroup): { sameAsOldPassword: boolean } | null {
  const oldPassword = group.get('oldPassword').value;
  const password = group.get('password').value;

  return oldPassword === password ? { sameAsOldPassword: true } : null;
}
