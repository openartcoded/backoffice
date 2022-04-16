import { Injectable, TemplateRef } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  showSuccess(textOrTpl: string | TemplateRef<any>, delay = 4000) {
    this.show(textOrTpl, { classname: 'bg-success text-light', delay });
  }

  showDanger(textOrTpl: string | TemplateRef<any>, delay = 4000) {
    this.show(textOrTpl, { classname: 'bg-danger text-light', delay });
  }

  remove(toast) {
    this.toasts = this.toasts.filter((t) => t !== toast);
  }

  clear() {
    this.toasts.splice(0, this.toasts.length);
  }
}
