import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { OnDestroy } from '@angular/core';

export class RegisteredEvent {
  static CV_REQUEST: string = 'CV_REQUEST';
  static NEW_FEE: string = 'NEW_FEE';
  static NEW_INVOICE: string = 'NEW_INVOICE';
  static MEMZ_SET_VISIBLE: string = 'MEMZ_SET_VISIBLE';
  static MEMZ_DELETED: string = 'MEMZ_DELETED';
  static MEMZ_ADDED: string = 'MEMZ_ADDED';
  static NEW_PROSPECT: string = 'NEW_PROSPECT';
  static TICK_THRESHOLD: string = 'TICK_THRESHOLD';
  static NEW_DUMP: string = 'NEW_DUMP';
  static RESTORE_DUMP: string = 'RESTORE_DUMP';
  static NEW_DUMP_DOWNLOAD: string = 'NEW_DUMP_DOWNLOAD';
  static ADMINISTRATIVE_DOCUMENT_ADDED: string = 'ADMINISTRATIVE_DOCUMENT_ADDED';
  static ADMINISTRATIVE_DOCUMENT_DELETED: string = 'ADMINISTRATIVE_DOCUMENT_DELETED';
  static PERSONAL_INFO_UPDATED: string = 'PERSONAL_INFO_UPDATED';
  static REMINDER_TASK_ADD_OR_UPDATE: string = 'REMINDER_TASK_ADD_OR_UPDATE';
  static REMINDER_TASK_DELETE: string = 'REMINDER_TASK_DELETE';
  static REMINDER_TASK_NOTIFY: string = 'REMINDER_TASK_NOTIFY';
  static CLOSED_TIMESHEET: string = 'CLOSED_TIMESHEET';
  static REOPENED_TIMESHEET: string = 'REOPENED_TIMESHEET';
  static BILLABLE_CLIENT_UPLOAD_ADDED: string = 'BILLABLE_CLIENT_UPLOAD_ADDED';
  static BILLABLE_CLIENT_UPLOAD_DELETED: string = 'BILLABLE_CLIENT_UPLOAD_DELETED';
  static BILLABLE_CLIENT_ERROR: string = 'BILLABLE_CLIENT_ERROR';

}

export interface OnApplicationEvent extends OnDestroy {
  handle(events: ArtcodedNotification[]);

  shouldMarkEventAsSeenAfterConsumed(): boolean;

  shouldHandle(event: ArtcodedNotification): boolean;
}
