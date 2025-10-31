import { Component, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Label } from '@core/models/fee';
import { firstValueFrom } from 'rxjs';
import { LabelService } from '@core/service/label.service';
import { ToastService } from '@core/service/toast.service';
import { User } from '@core/models/user';

@Component({
  selector: 'app-default-price',
  templateUrl: './default-price.component.html',
  styleUrls: ['./default-price.component.scss'],
  standalone: false,
})
export class DefaultPriceComponent implements OnInit {
  form: UntypedFormGroup;
  tags: Label[];
  @Input()
  user: User;

  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private labelService: LabelService,
    private toastService: ToastService,
    private fb: UntypedFormBuilder,
  ) {}

  async ngOnInit() {
    this.tags = await firstValueFrom(this.labelService.findAll());
    this.loadForm();
  }

  loadForm() {
    const defaultPrices = [];
    for (const tag of this.tags.sort((a, b) => a.name.localeCompare(b.name))) {
      defaultPrices.push(this.convertPrice(tag));
    }
    this.form = this.fb.group({
      defaultPrices: this.fb.array(defaultPrices),
    });
  }

  get defaultPrices(): UntypedFormArray {
    return this.form.get('defaultPrices') as UntypedFormArray;
  }

  add($event: MouseEvent) {
    $event.preventDefault();
    if (!this.hasRoleAdmin) {
      return;
    }
    this.defaultPrices.push(
      this.convertPrice({
        id: null,
      }),
    );
  }
  remove($event: MouseEvent, idx: number) {
    $event.preventDefault();
    if (!this.hasRoleAdmin) {
      return;
    }
    this.defaultPrices.removeAt(idx);
  }
  canRemove(idx: number) {
    const group = this.defaultPrices.at(idx);
    if (!this.hasRoleAdmin) {
      return true;
    }
    return !group.get('id').value?.length;
  }

  convertPrice(price: Label): UntypedFormGroup {
    return new UntypedFormGroup({
      id: new UntypedFormControl({
        value: price.id,
        disabled: true,
      }),
      hidden: new UntypedFormControl({
        value: price.hidden || false,
        disabled: !this.hasRoleAdmin,
      }),
      colorHex: new UntypedFormControl(
        {
          value: price.colorHex,
          disabled: !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      tag: new UntypedFormControl(
        {
          value: price.name,
          disabled: price.name?.length || !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      priceHVAT: new UntypedFormControl(
        {
          value: price.priceHVAT,
          disabled: price.noDefaultPrice || !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
      vat: new UntypedFormControl(
        {
          value: price.vat,
          disabled: price.noDefaultPrice || !this.hasRoleAdmin,
        },
        [Validators.required],
      ),
    });
  }
  changeTextToUppercase(idx: any) {
    const field = this.defaultPrices.at(idx).get('tag');
    field.patchValue(field.value?.toUpperCase());
  }

  async submit() {
    if (!this.hasRoleAdmin) {
      return;
    }
    const labels = this.defaultPrices.controls?.map((p) => {
      return {
        id: p.get('id').value,
        name: p.get('tag').value,
        colorHex: p.get('colorHex').value,
        priceHVAT: p.get('priceHVAT').value,
        vat: p.get('vat').value,
        hidden: p.get('hidden').value,
      };
    });
    this.tags = await firstValueFrom(this.labelService.updateAll(labels));
    this.toastService.showSuccess('Labels saved');
    this.form.reset();
    this.loadForm();
  }
}
