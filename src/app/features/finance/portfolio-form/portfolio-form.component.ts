import { Component, EventEmitter, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { formatDate } from '@angular/common';
import { Portfolio } from '@core/models/portfolio';

@Component({
  selector: 'app-portfolio-form',
  templateUrl: './portfolio-form.component.html',
  styleUrls: ['./portfolio-form.component.scss'],
})
export class PortfolioFormComponent implements OnInit {
  portfolioForm: FormGroup;
  portfolio: Portfolio;
  submitted: EventEmitter<Portfolio> = new EventEmitter<Portfolio>();

  constructor(@Optional() public activeModal: NgbActiveModal, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.portfolioForm = this.createFormGroup();
  }

  createFormGroup(): FormGroup {
    return this.fb.group({
      portfolioId: new FormControl({ value: this.portfolio.id, disabled: true }, []),
      portfolioName: new FormControl(this.portfolio.name, [Validators.minLength(4)]),

      updatedDate: new FormControl(
        {
          value: this.portfolio.updatedDate ? formatDate(this.portfolio.updatedDate, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        []
      ),
      current: new FormControl(this.portfolio.principal, []),

      dateCreation: new FormControl(
        {
          value: this.portfolio.dateCreation ? formatDate(this.portfolio.dateCreation, 'dd/MM/yyyy HH:mm', 'de') : null,
          disabled: true,
        },
        []
      ),
    });
  }

  send() {
    this.submitted.emit({
      id: this.portfolio.id,
      name: this.portfolioForm.controls.portfolioName.value,
      principal: this.portfolioForm.controls.current.value,
    });
    this.portfolioForm.reset();
  }
}
