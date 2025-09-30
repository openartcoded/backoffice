import { Component, OnInit } from '@angular/core';
import { ReminderTask } from '@core/models/reminder-task';
import { ReminderTaskService } from '@core/service/reminder.task.service';
import { TaskDetailComponent } from '@feature/tasks/task-detail/task-detail.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable, firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-next-tasks',
    templateUrl: './next-tasks.component.html',
    styleUrls: ['./next-tasks.component.scss'],
    standalone: false
})
export class NextTasksComponent implements OnInit {
  reminderTasks$: Observable<ReminderTask[]>;
  constructor(
    private reminderTaskService: ReminderTaskService,
    private modalService: NgbModal,
  ) { }
  ngOnInit(): void {
    this.load();
  }
  load() {
    this.reminderTasks$ = this.reminderTaskService.findNextTenTasks();
  }

  getTaskName(task: ReminderTask): string {
    let name = task.customActionName || task.title;
    // trim
    if (name?.length > 15) {
      name = name.substring(0, 15) + '...';
    }
    return name;
  }
  openTask(task: ReminderTask) {
    const modal = this.modalService.open(TaskDetailComponent, {
      size: 'xl',
      scrollable: true,
      backdrop: 'static',
    });
    modal.componentInstance.task = task;
    modal.componentInstance.allowedActions$ = this.reminderTaskService.allowedActions();
    modal.componentInstance.onSaveTask.subscribe(async (taskToSave: ReminderTask) => {
      modal.close();
      await firstValueFrom(this.reminderTaskService.save(taskToSave));
      this.load();
    });
    modal.componentInstance.onDeleteTask.subscribe(async (taskToDelete: ReminderTask) => {
      modal.close();
      await firstValueFrom(this.reminderTaskService.delete(taskToDelete.id));
      this.load();
    });
  }
}
