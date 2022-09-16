import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Html2canvasService {
  private static _html2canvas: any;
  constructor() { }

  static set html2canvas(library: any) {
    Html2canvasService._html2canvas = library;
  }

  get html2canvas() {
    return Html2canvasService._html2canvas || ((_) => {});
  }
}
