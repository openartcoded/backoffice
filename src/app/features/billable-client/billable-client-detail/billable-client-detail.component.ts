import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BillableClient, ContractStatus } from '@core/models/billable-client';
import { RateType } from '@core/models/common';
import { DateUtils } from '@core/utils/date-utils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-billable-client-detail',
  templateUrl: './billable-client-detail.component.html',
  styleUrls: ['./billable-client-detail.component.scss'],
})
export class BillableClientDetailComponent implements OnInit {
  @Input()
  client: BillableClient;

  @Output()
  onSaveClient: EventEmitter<BillableClient> = new EventEmitter<BillableClient>();

  clientForm: UntypedFormGroup;

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: UntypedFormBuilder) {}

  ngOnInit(): void {
    this.clientForm = this.fb.group({
      vatNumber: new UntypedFormControl({ value: this.client?.vatNumber, disabled: false }, [Validators.required]),
      maxDaysToPay: new UntypedFormControl({ value: this.client?.maxDaysToPay, disabled: false }, [
        Validators.required,
        Validators.min(0),
      ]),
      clientName: new UntypedFormControl({ value: this.client?.name, disabled: false }, [Validators.required]),
      city: new UntypedFormControl({ value: this.client?.city, disabled: false }, [Validators.required]),
      address: new UntypedFormControl({ value: this.client?.address, disabled: false }, [Validators.required]),
      emailAddress: new UntypedFormControl(
        {
          value: this.client?.emailAddress,
          disabled: false,
        },
        []
      ),
      projectName: new UntypedFormControl({ value: this.client?.projectName, disabled: false }, [Validators.required]),
      rate: new UntypedFormControl({ value: this.client?.rate, disabled: false }, [Validators.required]),
      rateType: new UntypedFormControl({ value: this.client?.rateType, disabled: false }, [Validators.required]),

      startDate: new UntypedFormControl(DateUtils.formatInputDate(DateUtils.toDateOrNow(this.client?.startDate)), [Validators.required]),
      endDate: new UntypedFormControl(DateUtils.formatInputDate(DateUtils.toOptionalDate(this.client?.endDate)), []),
      contractStatus: new UntypedFormControl({ value: this.client?.contractStatus, disabled: false }, [
        Validators.required,
      ]),
      phoneNumber: new UntypedFormControl({ value: this.client?.phoneNumber, disabled: false }, []),
    });
  }
  get startDate(): string {
    return this.clientForm.get('startDate').value;
  }

  get endDate(): string {
    return this.clientForm.get('endDate').value;
  }

  getRateType() {
    return [RateType[RateType.DAYS], RateType[RateType.HOURS]];
  }

  getContractStatus() {
    return [
      ContractStatus[ContractStatus.NOT_STARTED_YET],
      ContractStatus[ContractStatus.ONGOING],
      ContractStatus[ContractStatus.DONE],
    ];
  }

  send() {
    this.onSaveClient.emit({
      id: this.client?.id,
      vatNumber: this.clientForm.get('vatNumber').value,
      name: this.clientForm.get('clientName').value,
      city: this.clientForm.get('city').value,
      address: this.clientForm.get('address').value,
      emailAddress: this.clientForm.get('emailAddress').value,
      phoneNumber: this.clientForm.get('phoneNumber').value,
      projectName: this.clientForm.get('projectName').value,
      rate: this.clientForm.get('rate').value,
      rateType: this.clientForm.get('rateType').value,
      contractStatus: this.clientForm.get('contractStatus').value,
      maxDaysToPay: this.clientForm.get('maxDaysToPay').value,
      startDate: DateUtils.getDateFromInput(this.clientForm.get('startDate').value),
      endDate: DateUtils.getDateFromInput(this.clientForm.get('endDate').value),
    });
  }
}
