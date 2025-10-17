import { UntypedFormGroup } from '@angular/forms';
import moment from 'moment';

export function DateInFutureValidator(controlName: string) {
  return (formGroup: UntypedFormGroup) => {
    let control = formGroup.controls[controlName];
    let start = moment(control.value, 'YYYY-MM-DD');
    let end = moment();

    if (control.errors && !control.errors.dateInFuture) {
      return;
    }
    if (moment.duration(end.diff(start)).asDays() < 0) {
      control.setErrors({ dateInFuture: true });
    } else {
      control.setErrors(null);
    }
  };
}
