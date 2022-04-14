import { Component, EventEmitter, Input, OnInit, Optional, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Fee, Label } from '@core/models/fee';
import { Dossier } from '@core/models/dossier';
import { LabelService } from '@core/service/label.service';

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

  @Input()
  labels: Label[];

  @Output()
  selectedFeeRemoved: EventEmitter<Fee> = new EventEmitter<Fee>();
  @Output()
  processValidated: EventEmitter<Fee[]> = new EventEmitter<Fee[]>();

  constructor(@Optional() public activeModal: NgbActiveModal, private labelService: LabelService) {}

  ngOnInit(): void {}

  getStyleForTag(f: Fee) {
    const label = this.labels.find((l) => l.name === f.tag);
    if (!label) {
      console.log('no label found! weird...');
      return { color: '#FFFFFF' };
    }
    return { color: label.colorHex };
  }

  removeFee($event: MouseEvent, fee: Fee) {
    this.selectedFeeRemoved.emit(fee);
    this.selectedFees = this.selectedFees.filter((f) => fee.id !== f.id);
  }

  processFees() {
    this.processValidated.emit(this.selectedFees);
  }
}
