import { Component, OnInit } from '@angular/core';
import { NotificationService } from '@core/service/notification.service';
import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { OnApplicationEvent, RegisteredEvent } from '@core/interface/on-application-event';
import { DateUtils } from '@core/utils/date-utils';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss'],
})
export class NotificationComponent implements OnInit, OnApplicationEvent {
  latests: ArtcodedNotification[] = [];

  constructor(private router: Router, private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notificationService.subscribe(this);
  }

  handle(events: ArtcodedNotification[]) {
    this.latests = this.latests
      .filter((latest) => !events.find((evt) => evt.id === latest.id))
      .concat(...events)
      .sort(
        (n1, n2) =>
          DateUtils.getDateFromInput(n2.receivedDate).getTime() - DateUtils.getDateFromInput(n1.receivedDate).getTime()
      );
  }

  shouldHandle(event: ArtcodedNotification): boolean {
    return true;
  }

  update(n: ArtcodedNotification) {
    this.notificationService.update(n.id, !n.seen).subscribe((d) => {
      this.latests.filter((notif) => notif.id === n.id).forEach((notif) => (notif.seen = !n.seen));
      this.notificationService.updateTitle(this.latests);
    });
  }

  async toggleAllSeen() {
    const notifications = this.latests || [];
    for (let n of notifications) {
      if (!n.seen) {
        firstValueFrom(this.notificationService.update(n.id, true));
      }
    }
    notifications.forEach((notif) => (notif.seen = true));
    this.notificationService.updateTitle(notifications);
  }

  navigate(p: NgbPopover, n: ArtcodedNotification) {
    p.close();
    n.seen = false;
    this.update(n);
    switch (n.type) {
      case RegisteredEvent.NEW_PROSPECT:
        this.router.navigateByUrl('/services');
        break;
      case RegisteredEvent.TICK_THRESHOLD:
        this.router.navigateByUrl('/finance');
        break;
      case RegisteredEvent.CV_REQUEST:
        this.router.navigateByUrl('/cv/download-requests');
        break;
      case RegisteredEvent.NEW_FEE:
        this.router.navigateByUrl('/fee');
        break;
      case RegisteredEvent.NEW_INVOICE:
        this.router.navigateByUrl('/invoice');
        break;
      case RegisteredEvent.CLOSED_TIMESHEET:
      case RegisteredEvent.REOPENED_TIMESHEET:
        this.router.navigateByUrl('/timesheets');
        break;
      case RegisteredEvent.MEMZ_SET_VISIBLE:
      case RegisteredEvent.MEMZ_DELETED:
      case RegisteredEvent.MEMZ_ADDED:
        this.router.navigateByUrl('/memzagram');
        break;
    }
  }

  get unseenCount(): number {
    return this.notificationService.unseenCount;
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribe(this);
  }

  shouldMarkEventAsSeenAfterConsumed(): boolean {
    return false;
  }
}
