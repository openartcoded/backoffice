import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'trim',
    standalone: false,
})
export class TrimPipe implements PipeTransform {
    transform(value: string, length: number): string {
        const sub = value.substring(0, length);
        if (sub.length != value.length) {
            return sub + '...';
        }
        return sub;
    }
}
