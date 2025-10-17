import { AfterViewInit, Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: false,
})
export class AutoFocusDirective implements AfterViewInit {
  constructor(private element: ElementRef<HTMLInputElement>) {}

  ngAfterViewInit(): void {
    this.element.nativeElement.focus();
  }
}
