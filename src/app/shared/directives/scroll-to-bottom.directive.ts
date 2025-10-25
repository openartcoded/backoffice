import { Directive, ElementRef, AfterViewInit, OnChanges } from '@angular/core';

@Directive({
  selector: '[appScrollToBottom]',
  standalone: false,
  exportAs: 'scrollToBottom',
})
export class ScrollToBottomDirective implements AfterViewInit, OnChanges {
  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  ngOnChanges() {
    this.scrollToBottom();
  }

  public scrollToBottom() {
    setTimeout(() => {
      this.el.nativeElement.scrollTop = this.el.nativeElement.scrollHeight;
    }, 220);
  }
}
