import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Label } from '@core/models/fee';
import { firstValueFrom, Observable } from 'rxjs';
import { LabelService } from '@core/service/label.service';
import { ToastService } from '@core/service/toast.service';

@Component({
  selector: 'app-default-price',
  templateUrl: './default-price.component.html',
  styleUrls: ['./default-price.component.scss'],
})
export class DefaultPriceComponent implements OnInit {
  form: FormGroup;
  tags: Label[];
  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private labelService: LabelService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {}

  async ngOnInit() {
    this.tags = await firstValueFrom(this.labelService.findAll());
    this.loadForm();
  }

  loadForm() {
    this.form = this.fb.group({
      defaultPrices: this.fb.array(this.tags.sort((a, b) => a.name.localeCompare(b.name)).map(this.convertPrice)),
    });
  }

  get defaultPrices(): FormArray {
    return this.form.get('defaultPrices') as FormArray;
  }

  add($event: MouseEvent) {
    $event.preventDefault();
    this.defaultPrices.push(
      this.convertPrice({
        id: null,
      })
    );
  }
  remove($event: MouseEvent, idx: number) {
    $event.preventDefault();
    this.defaultPrices.removeAt(idx);
  }
  canRemove(idx: number) {
    const group = this.defaultPrices.at(idx);
    return group.get('id').value?.length;
  }

  convertPrice(price: Label): FormGroup {
    return new FormGroup({
      id: new FormControl({
        value: price.id,
        disabled: true,
      }),
      colorHex: new FormControl(
        {
          value: price.colorHex,
          disabled: false,
        },
        [Validators.required]
      ),
      tag: new FormControl(
        {
          value: price.name,
          disabled: price.name?.length,
        },
        [Validators.required]
      ),
      priceHVAT: new FormControl(
        {
          value: price.priceHVAT,
          disabled: price.noDefaultPrice,
        },
        [Validators.required]
      ),
      vat: new FormControl(
        {
          value: price.vat,
          disabled: price.noDefaultPrice,
        },
        [Validators.required]
      ),
    });
  }
  changeTextToUppercase(idx) {
    const field = this.defaultPrices.at(idx).get('tag');
    field.patchValue(field.value?.toUpperCase());
  }

  async submit() {
    const labels = this.defaultPrices.controls?.map((p) => {
      return {
        id: p.get('id').value,
        name: p.get('tag').value,
        colorHex: p.get('colorHex').value,
        priceHVAT: p.get('priceHVAT').value,
        vat: p.get('vat').value,
      };
    });
    this.tags = await firstValueFrom(this.labelService.updateAll(labels));
    this.toastService.showSuccess('Labels saved');
    this.form.reset();
    this.loadForm();
  }
}
