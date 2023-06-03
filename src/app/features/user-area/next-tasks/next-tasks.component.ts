import { Component, OnInit } from '@angular/core';
import { ReminderTask } from '@core/models/reminder-task';
import { ReminderTaskService } from '@core/service/reminder.task.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-next-tasks',
  templateUrl: './next-tasks.component.html',
  styleUrls: ['./next-tasks.component.scss']
})
export class NextTasksComponent implements OnInit {
  reminderTasks$: Observable<ReminderTask[]>;
  constructor(private reminderTaskService: ReminderTaskService) {

  }
  ngOnInit(): void {
    this.reminderTasks$ = this.reminderTaskService.findNextTenTasks();
  }

}
