import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Fee, FeeTagColorUtils } from '@core/models/fee';
import { Dossier } from '@core/models/dossier';

@Component({
  selector: 'app-fee-process-validation',
  templateUrl: './fee-process-validation.component.html',
  styleUrls: ['./fee-process-validation.component.scss'],
})
export class FeeProcessValidationComponent implements OnInit {
  @Input()
  selectedFees: Fee[];
  @Input()
  activeDossier: Dossier;

  @Output()
  selectedFeeRemoved: EventEmitter<Fee> = new EventEmitter<Fee>();
  @Output()
  processValidated: EventEmitter<Fee[]> = new EventEmitter<Fee[]>();

  constructor(@Optional() public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  getClassForTag(f: Fee) {
    return FeeTagColorUtils.getClassForTag(f);
  }

  removeFee($event: MouseEvent, fee: Fee) {
    this.selectedFeeRemoved.emit(fee);
    this.selectedFees = this.selectedFees.filter((f) => fee.id !== f.id);
  }

  processFees() {
    this.processValidated.emit(this.selectedFees);
  }
}
