import { FormGroup } from '@angular/forms';
import * as moment from 'moment';

export function DateInPastValidator(controlName: string) {
  return (formGroup: FormGroup) => {
    let control = formGroup.controls[controlName];

    if (control.errors && !control.errors.dateInFuture) {
      return;
    }
    let start = moment(control.value, 'YYYY-MM-DD');
    let end = moment();
    if (moment.duration(end.diff(start)).asDays() > 0) {
      control.setErrors({ dateInFuture: true });
    } else {
      control.setErrors(null);
    }
  };
}
