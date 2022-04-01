import { EventEmitter, Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class ToggleSidebarService {
  toggleSideBarEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private breakPointObserver: BreakpointObserver) {}

  toggleCheck(): boolean {
    const isDesktop = this.breakPointObserver.isMatched('(min-width: 768px)');
    const toggle = isDesktop;
    this.toggleSideBarEvent.emit(toggle);
    return toggle;
  }

  expand(toggle: boolean) {
    const tog = !toggle;
    this.toggleSideBarEvent.emit(tog);
    return tog;
  }
}
