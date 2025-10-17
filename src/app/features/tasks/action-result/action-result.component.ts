import { Component, Input, OnInit, Optional } from '@angular/core';
import { Page } from '@core/models/page';
import { ActionResult } from '@core/models/reminder-task';
import { ReminderTaskService } from '@core/service/reminder.task.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-action-result',
  templateUrl: './action-result.component.html',
  styleUrls: ['./action-result.component.scss'],
  standalone: false,
})
export class ActionResultComponent implements OnInit {
  @Input()
  actionKey: string;
  pageSize: number = 2;

  actionResults$: Observable<Page<ActionResult>>;

  constructor(
    private taskService: ReminderTaskService,
    @Optional() public activeModal: NgbActiveModal,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(event: number = 1) {
    this.actionResults$ = this.taskService.actionResults(this.actionKey, event, this.pageSize);
  }
}
