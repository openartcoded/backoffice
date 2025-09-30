import { Component, Input } from '@angular/core';
import { PeppolValidationResult } from '@core/models/invoice';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-peppol-validation-result',
    templateUrl: './peppol-validation-result.component.html',
    styleUrl: './peppol-validation-result.component.scss',
    standalone: false
})
export class PeppolValidationResultComponent {
    @Input()
    result: PeppolValidationResult;

    constructor(
        public activeModal: NgbActiveModal,
    ) { }
}
