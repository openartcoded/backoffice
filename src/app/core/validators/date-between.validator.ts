import { UntypedFormGroup } from '@angular/forms';
import * as moment from 'moment';

export function DateBetweenValidator(controlName: string, matchingControlName: string) {
  return (formGroup: UntypedFormGroup) => {
    let control = formGroup.controls[controlName];
    let matchingControl = formGroup.controls[matchingControlName];
    let start = moment(control.value, 'YYYY-MM-DD');
    let end = moment(matchingControl.value, 'YYYY-MM-DD');
    if (matchingControl.errors && !matchingControl.errors.dateInFuture) {
      return;
    }
    if (moment.duration(end.diff(start)).asDays() < 0) {
      matchingControl.setErrors({ dateInFuture: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
