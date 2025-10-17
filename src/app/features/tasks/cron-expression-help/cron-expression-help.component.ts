import { Component, OnInit, Optional } from '@angular/core';
import { ReminderTaskService } from '@core/service/reminder.task.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cron-expression-help',
  templateUrl: './cron-expression-help.component.html',
  styleUrls: ['./cron-expression-help.component.scss'],
  standalone: false,
})
export class CronExpressionHelpComponent implements OnInit {
  cronExpression: string = null;
  valid?: boolean = null;

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private reminderTaskService: ReminderTaskService,
  ) {}

  ngOnInit(): void {}

  async validateCronExpression() {
    this.valid = null;
    const resp = await firstValueFrom(this.reminderTaskService.validateCronExpression(this.cronExpression));
    this.valid = resp.valid;
  }
}
