import { Component, OnInit } from '@angular/core';
import { ReminderTaskService } from '@core/service/reminder.task.service';
import { ReminderTask } from '@core/models/reminder-task';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TaskDetailComponent } from '@feature/tasks/task-detail/task-detail.component';
import { OnApplicationEvent, RegisteredEvent } from '@core/interface/on-application-event';
import { NotificationService } from '@core/service/notification.service';
import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { CronExpressionHelpComponent } from '@feature/tasks/cron-expression-help/cron-expression-help.component';
import { ActionResultComponent } from '../action-result/action-result.component';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-tasks-table',
  templateUrl: './tasks-table.component.html',
  styleUrls: ['./tasks-table.component.scss'],
})
export class TasksTableComponent implements OnInit, OnApplicationEvent {
  reminderTasks: ReminderTask[];
  filteredReminderTasks: ReminderTask[];
  showTasks: boolean = true;
  hideDisabled: boolean = true;

  constructor(
    private reminderTaskService: ReminderTaskService,
    private notificationService: NotificationService,
    private titleService: Title,
    private modalService: NgbModal
  ) {}

  ngOnInit(): void {
    this.notificationService.subscribe(this);
    this.titleService.setTitle('Tasks');
    this.load();
  }

  async openTask(task: ReminderTask = { title: '', description: '', disabled: false }) {
    const modal = this.modalService.open(TaskDetailComponent, {
      size: 'xl',
      scrollable: true,
    });
    modal.componentInstance.task = task;
    modal.componentInstance.allowedActions$ = this.reminderTaskService.allowedActions();
    modal.componentInstance.onSaveTask.subscribe(async (taskToSave) => {
      modal.close();
      await this.reminderTaskService.save(taskToSave).toPromise();
    });
    modal.componentInstance.onDeleteTask.subscribe(async (taskToDelete) => {
      modal.close();
      await this.reminderTaskService.delete(taskToDelete.id).toPromise();
    });
  }

  async load() {
    this.reminderTasks = await this.reminderTaskService.findAll().toPromise();
    this.filteredReminderTasks = this.reminderTasks;
    this.toggleTask();
    this.toggleDisabled();
  }

  handle(events: ArtcodedNotification[]) {
    this.load();
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribe(this);
  }

  shouldHandle(event: ArtcodedNotification): boolean {
    return (
      !event.seen &&
      (event.type === RegisteredEvent.REMINDER_TASK_ADD_OR_UPDATE ||
        event.type === RegisteredEvent.REMINDER_TASK_DELETE)
    );
  }

  shouldMarkEventAsSeenAfterConsumed(): boolean {
    return true;
  }

  openCronExpressionHelp() {
    this.modalService.open(CronExpressionHelpComponent, { size: 'lg' });
  }

  toggleTask() {
    if (this.showTasks) {
      this.filteredReminderTasks = this.reminderTasks;
    } else {
      this.filteredReminderTasks = this.reminderTasks.filter((task) => !task.actionKey);
    }
  }

  toggleDisabled() {
    if (!this.hideDisabled) {
      this.filteredReminderTasks = this.reminderTasks;
    } else {
      this.filteredReminderTasks = this.reminderTasks.filter((task) => !task.disabled);
    }
  }
  openActionResult(task: ReminderTask, $event: any) {
    $event.stopPropagation();
    const modal = this.modalService.open(ActionResultComponent, {
      size: 'xl',
      scrollable: true,
    });
    modal.componentInstance.actionKey = task.actionKey;
  }
}
