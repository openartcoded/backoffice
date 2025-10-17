import { Component, OnInit, Optional } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { CacheService } from '@core/service/cache.service';
import { ToastService } from '@core/service/toast.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cache',
  templateUrl: './cache.component.html',
  styleUrls: ['./cache.component.scss'],
  standalone: false,
})
export class CacheComponent implements OnInit {
  form: UntypedFormGroup;
  cacheNames$: Observable<string[]>;
  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fb: UntypedFormBuilder,
    private toastService: ToastService,
    private cacheService: CacheService,
  ) {}
  ngOnInit(): void {
    this.cacheNames$ = this.cacheService.findAll();
    this.form = this.fb.group({
      cache: new UntypedFormControl({ value: null, disabled: false }, [Validators.required]),
    });
  }
  async clear() {
    const message = await firstValueFrom(this.cacheService.clear(this.form.get('cache').value));
    this.toastService.showSuccess(message.message);
  }
}
