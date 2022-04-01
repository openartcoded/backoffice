import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'trim',
})
export class TrimPipe implements PipeTransform {
  transform(value: string, length: number): string {
    return value.substring(0, length);
  }
}
