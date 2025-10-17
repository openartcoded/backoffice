import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bytesToHuman',
  standalone: false,
})
export class BytesToHumanPipe implements PipeTransform {
  transform(value: number, si = false, dp = 1): unknown {
    const thresh = si ? 1000 : 1024;

    if (Math.abs(value) < thresh) {
      return value + ' B';
    }

    const units = si
      ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;
    const r = 10 ** dp;

    do {
      value /= thresh;
      ++u;
    } while (Math.round(Math.abs(value) * r) / r >= thresh && u < units.length - 1);

    return value.toFixed(dp) + ' ' + units[u];
  }
}
