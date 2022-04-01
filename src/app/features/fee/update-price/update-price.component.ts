import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Fee, FeeUpdatePriceRequest } from '@core/models/fee';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-update-price',
  templateUrl: './update-price.component.html',
  styleUrls: ['./update-price.component.scss'],
})
export class UpdatePriceComponent implements OnInit {
  @Input()
  fee: Fee;

  @Output()
  updatePriceSubmitted: EventEmitter<FeeUpdatePriceRequest> = new EventEmitter<FeeUpdatePriceRequest>();
  form: FormGroup;
  saved: boolean;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: new FormControl({ value: this.fee.id, disabled: true }, [Validators.required]),
      priceHVat: new FormControl({ value: this.fee.priceHVAT, disabled: this.fee?.archived }, [Validators.required]),
      vat: new FormControl({ value: this.fee.vat, disabled: this.fee?.archived }, [Validators.required]),
      priceTot: new FormControl({ value: this.fee.priceTot, disabled: true }, [Validators.required]),
    });
  }

  submit() {
    this.updatePriceSubmitted.emit({
      id: this.fee.id,
      priceHVAT: this.priceHVat,
      vat: this.vat,
    });
    this.saved = true;
    setTimeout(() => {
      this.saved = false;
    }, 3000);
  }

  get priceHVat(): number {
    return this.form.get('priceHVat').value;
  }

  get vat(): number {
    return this.form.get('vat').value;
  }
}
