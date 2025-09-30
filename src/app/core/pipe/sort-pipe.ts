import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'sort',
    standalone: false
})
export class SortPipe implements PipeTransform {
  transform(ary: any, fn: Function = (a, b) => (a > b ? 1 : -1)): any[] {
    return ary.sort(fn);
  }
}
