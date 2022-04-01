import { Injectable } from '@angular/core';

function getWindow(): any {
  return window;
}

@Injectable({
  providedIn: 'root',
})
export class WindowRefService {
  get nativeWindow(): Window {
    return getWindow();
  }
}
