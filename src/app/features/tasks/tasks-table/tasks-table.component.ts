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
import { firstValueFrom } from 'rxjs';
import * as moment from 'moment';

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
  currentDate: Date;

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
      await firstValueFrom(this.reminderTaskService.save(taskToSave));
    });
    modal.componentInstance.onDeleteTask.subscribe(async (taskToDelete) => {
      modal.close();
      await firstValueFrom(this.reminderTaskService.delete(taskToDelete.id));
    });
  }

  async load() {
    this.reminderTasks = await firstValueFrom(this.reminderTaskService.findAll());
    this.filteredReminderTasks = this.reminderTasks;
    const dates = this.nextDates;
    if (dates?.length) {
      this.filterTasks(dates[0]);
    } else {
      this.filterTasks(null);
    }
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

  openActionResult(task: ReminderTask, $event: any) {
    $event.stopPropagation();
    const modal = this.modalService.open(ActionResultComponent, {
      size: 'xl',
      scrollable: true,
    });
    modal.componentInstance.actionKey = task.actionKey;
  }

  get nextDates() {
    const dates = (this.reminderTasks || [])
      .filter((t) => t.nextDate)
      .map((t) => moment(new Date(t.nextDate)).startOf('day').add(2, 'hour').toDate().getTime());
    return [...new Set(dates)].map((d) => new Date(d)).sort((a, b) => a.getTime() - b.getTime());
  }

  filterTasks(date?: Date) {
    let tasks = [...this.reminderTasks];
    if (!this.showTasks) {
      tasks = tasks.filter((task) => !task.actionKey);
    }
    if (this.hideDisabled) {
      tasks = tasks.filter((task) => !task.disabled);
    }
    this.currentDate = date;
    if (date) {
      tasks = tasks.filter((t) => {
        return !t.nextDate || moment(new Date(t.nextDate)).format('D/MM/yyyy') === moment(date).format('D/MM/yyyy');
      });
    }
    this.filteredReminderTasks = tasks;
  }
}
