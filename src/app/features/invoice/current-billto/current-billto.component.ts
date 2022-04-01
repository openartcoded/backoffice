import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { CurrentBillTo, InvoicingType } from '@core/models/invoice';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-current-billto',
  templateUrl: './current-billto.component.html',
  styleUrls: ['./current-billto.component.scss'],
})
export class CurrentBilltoComponent implements OnInit {
  @Input()
  currentBillTo: CurrentBillTo;

  @Output()
  onSaveCurrentBillTo: EventEmitter<CurrentBillTo> = new EventEmitter<CurrentBillTo>();

  currentBillToForm: FormGroup;

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.currentBillToForm = this.fb.group({
      billToVatNumber: new FormControl({ value: this.currentBillTo?.billTo?.vatNumber, disabled: false }, [
        Validators.required,
      ]),
      maxDaysToPay: new FormControl({ value: this.currentBillTo?.maxDaysToPay, disabled: false }, [
        Validators.required,
        Validators.min(0),
      ]),
      billToClientName: new FormControl({ value: this.currentBillTo?.billTo?.clientName, disabled: false }, [
        Validators.required,
      ]),
      billToCity: new FormControl({ value: this.currentBillTo?.billTo?.city, disabled: false }, [Validators.required]),
      billToAddress: new FormControl({ value: this.currentBillTo?.billTo?.address, disabled: false }, [
        Validators.required,
      ]),
      billToEmailAddress: new FormControl(
        {
          value: this.currentBillTo?.billTo?.emailAddress,
          disabled: false,
        },
        []
      ),
      projectName: new FormControl({ value: this.currentBillTo?.projectName, disabled: false }, [Validators.required]),
      rate: new FormControl({ value: this.currentBillTo?.rate, disabled: false }, [Validators.required]),
      rateType: new FormControl({ value: this.currentBillTo?.rateType, disabled: false }, [Validators.required]),
    });
  }

  getInvoiceType() {
    return [InvoicingType[InvoicingType.DAYS], InvoicingType[InvoicingType.HOURS]];
  }

  send() {
    this.onSaveCurrentBillTo.emit({
      billTo: {
        vatNumber: this.currentBillToForm.get('billToVatNumber').value,
        clientName: this.currentBillToForm.get('billToClientName').value,
        city: this.currentBillToForm.get('billToCity').value,
        address: this.currentBillToForm.get('billToAddress').value,
        emailAddress: this.currentBillToForm.get('billToEmailAddress').value,
      },
      projectName: this.currentBillToForm.get('projectName').value,
      rate: this.currentBillToForm.get('rate').value,
      rateType: this.currentBillToForm.get('rateType').value,
      maxDaysToPay: this.currentBillToForm.get('maxDaysToPay').value,
    });
  }
}
