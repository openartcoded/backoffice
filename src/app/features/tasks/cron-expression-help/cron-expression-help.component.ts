import { Component, OnInit, Optional } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-cron-expression-help',
  templateUrl: './cron-expression-help.component.html',
  styleUrls: ['./cron-expression-help.component.scss'],
})
export class CronExpressionHelpComponent implements OnInit {
  constructor(@Optional() public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}
}
