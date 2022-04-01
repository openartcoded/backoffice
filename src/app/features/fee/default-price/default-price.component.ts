import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DefaultPriceForTag } from '@core/models/fee';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-default-price',
  templateUrl: './default-price.component.html',
  styleUrls: ['./default-price.component.scss'],
})
export class DefaultPriceComponent implements OnInit {
  @Input()
  defaultPricesForTag$: Observable<DefaultPriceForTag[]>;
  form: FormGroup;
  @Output()
  onSubmit: EventEmitter<DefaultPriceForTag[]> = new EventEmitter<DefaultPriceForTag[]>();

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  async ngOnInit() {
    const prices = await this.defaultPricesForTag$.toPromise();
    this.form = this.fb.group({
      defaultPrices: this.fb.array(prices.map(this.convertPrice)),
    });
  }

  get defaultPrices(): FormArray {
    return this.form.get('defaultPrices') as FormArray;
  }

  convertPrice(price: DefaultPriceForTag): FormGroup {
    return new FormGroup({
      id: new FormControl(
        {
          value: price.id,
          disabled: true,
        },
        [Validators.required]
      ),
      tag: new FormControl(
        {
          value: price.tag,
          disabled: true,
        },
        [Validators.required]
      ),
      priceHVAT: new FormControl(
        {
          value: price.priceHVAT,
          disabled: false,
        },
        [Validators.required]
      ),
      vat: new FormControl(
        {
          value: price.vat,
          disabled: false,
        },
        [Validators.required]
      ),
    });
  }

  submit() {
    this.onSubmit.emit(
      this.defaultPrices.controls?.map((p) => {
        return {
          id: p.get('id').value,
          tag: p.get('tag').value,
          priceHVAT: p.get('priceHVAT').value,
          vat: p.get('vat').value,
        };
      })
    );
    this.form.reset();
  }
}
