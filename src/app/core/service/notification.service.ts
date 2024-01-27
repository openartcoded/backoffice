import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, OnInit, PLATFORM_ID } from '@angular/core';
import { Observable, of, RetryConfig, Subscription, throwError, timer } from 'rxjs';
import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { OnApplicationEvent } from '@core/interface/on-application-event';
import { catchError, retry, switchMap } from 'rxjs';
import { AuthService } from '@core/service/auth.service';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { ConfigInitService } from '@init/config-init.service';
import { PersonalInfoService } from './personal.info.service';

const GENERIC_RETRY_STRATEGY = () => {
  return {
    delay: (error, i) => {
      const maxRetryAttempts = 3;
      const scalingDuration = 5000;
      const excludedStatusCodes = [403, 401];
      const retryAttempt = i + 1;
      // if maximum number of retries have been met
      // or response is a status code we don't wish to retry, throw error
      if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find((e) => e === error.status)) {
        return throwError(() => error);
      }
      console.log(`Attempt ${retryAttempt}: retrying in ${retryAttempt * scalingDuration}ms`);
      // retry after 1s, 2s, etc...
      return timer(retryAttempt * scalingDuration);
    },
  } as RetryConfig;
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  pollingSub: Subscription;
  eventsAlreadySent: ArtcodedNotification[] = [];
  unseenCount: number;
  startedListening: boolean;

  private loggedOutSubscription: Subscription;

  private components: OnApplicationEvent[];

  constructor(
    private http: HttpClient,
    private titleService: Title,
    @Inject(PLATFORM_ID) private platformId: any,
    private configService: ConfigInitService,
    private personalInfoService: PersonalInfoService,
    private authService: AuthService,
  ) { }

  latests(): Observable<ArtcodedNotification[]> {
    return this.http.get<ArtcodedNotification[]>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/notification?ngsw-bypass=true`,
    );
  }

  update(notificationId: string, seen: boolean): Observable<any> {
    return this.http.post<any>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/notification?id=${notificationId}&seen=${seen}`,
      {},
    );
  }

  delete(notification: ArtcodedNotification): Observable<any> {
    return this.http.delete<any>(
      `${this.configService.getConfig()['BACKEND_URL']}/api/notification?id=${notification.id}`,
    );
  }

  private startListening() {
    if (isPlatformBrowser(this.platformId)) {
      this.personalInfoService.me().subscribe((user) => {
        if (user.authorities.includes('ADMIN')) {
          console.log('start listening...');
          this.components = [];
          this.pollingSub = timer(0, 5000)
            .pipe(
              switchMap((_) => {
                return this.latests();
              }),
              retry(GENERIC_RETRY_STRATEGY()),
              catchError((error) => of(error)),
            )
            .subscribe((notifications) => {
              this.updateTitle(notifications);
              const newEvents = notifications?.filter((n) => !this.eventsAlreadySent.find((x) => x.id === n.id));
              this.components.forEach((component) => {
                const componentEvents = newEvents.filter((evt) => component.shouldHandle(evt));
                if (componentEvents.length) {
                  component.handle(componentEvents);
                  if (component.shouldMarkEventAsSeenAfterConsumed()) {
                    this.markEventsAsSeen(componentEvents);
                  }
                }
              });
              this.eventsAlreadySent.push(...newEvents);
            });
          this.loggedOutSubscription = this.authService.loggedOut.subscribe((_) => this.stopListening());
        } else {
          console.log("user doesn't have admin role. do not listening to notifications");
        }
      });
    }
  }

  private stopListening() {
    this.pollingSub.unsubscribe();
    this.pollingSub = null;
    this.eventsAlreadySent = [];
    this.loggedOutSubscription.unsubscribe();
    this.loggedOutSubscription = null;
    this.components = [];
  }

  subscribe(onApplicationEvent: OnApplicationEvent): void {
    if (!this.pollingSub) {
      this.startListening();
    }
    this.components?.push(onApplicationEvent);
  }

  unsubscribe(onApplicationEvent: OnApplicationEvent): void {
    this.components = this.components?.filter((comp) => comp !== onApplicationEvent);
  }

  updateTitle(notifications: ArtcodedNotification[]) {
    this.unseenCount = notifications?.filter((n) => !n.seen).length || 0;
    this.titleService.setTitle(
      (this.unseenCount === 0 ? '' : `(${this.unseenCount})`) +
      this.titleService
        .getTitle()
        .replace(/\([\d]+\)/g, '')
        .trim(),
    );
  }

  markEventsAsSeen(events: ArtcodedNotification[]) {
    events.forEach((evt) => {
      this.update(evt.id, true).subscribe((d) => {
        this.eventsAlreadySent = this.eventsAlreadySent.filter((alreadySent) => alreadySent.id !== evt.id);
      });
    });
  }
}
