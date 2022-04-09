import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MemzService } from '@core/service/memz.service';
import { Memz } from '@core/models/memz';
import { Page } from '@core/models/page';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemagramEditorComponent } from '@feature/memagram/memagram-editor/memagram-editor.component';
import { FileService } from '@core/service/file.service';
import { tap } from 'rxjs/operators';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { NotificationService } from '@core/service/notification.service';
import { OnApplicationEvent, RegisteredEvent } from '@core/interface/on-application-event';
import { ArtcodedNotification } from '@core/models/artcoded.notification';

@Component({
  selector: 'app-meme-page',
  templateUrl: './meme-page.component.html',
  styleUrls: ['./meme-page.component.scss'],
})
export class MemePageComponent implements OnInit, OnApplicationEvent {
  memzPage: Page<Memz>;
  defaultPageSize: number = 12;

  constructor(
    private memzService: MemzService,
    private modalService: NgbModal,
    private domSanitizer: DomSanitizer,
    private notificationService: NotificationService,
    private fileService: FileService,
    private titleService: Title,
    private windowService: WindowRefService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Gallery');
    this.notificationService.subscribe(this);
    this.load();
  }

  edit($event, memz: Memz) {
    $event.stopPropagation();
    this.openFormModal(memz);
  }

  delete($event, memz: Memz) {
    $event.stopPropagation();
    if (isPlatformBrowser(this.platformId)) {
      let resp = this.windowService.nativeWindow.confirm('Are you sure you want to delete this row? ');
      if (resp) {
        this.memzService.delete(memz).subscribe((d) => {});
      }
    }
  }

  async openFormModal(meme: Memz = {} as Memz) {
    const modalRef = this.modalService.open(MemagramEditorComponent, {
      size: 'xl',
    });
    modalRef.componentInstance.meme = meme;
    modalRef.componentInstance.saved.subscribe((meme) => {
      // this.load();
    });
  }

  load(event: number = 1): void {
    this.memzService
      .adminFindAll(event - 1, this.defaultPageSize)
      .pipe(
        tap((page) => {
          page.content.forEach(async (memz) => {
            if (memz.visible) {
              memz.imageLink = this.fileService.getPublicDownloadUrl(memz.imageUploadId);
              memz.thumbnailLink = this.fileService.getPublicDownloadUrl(memz.thumbnailUploadId);
            } else {
              let thumbnailLink = await this.fileService
                .toDownloadLink(this.fileService.getDownloadUrl(memz.thumbnailUploadId))
                .toPromise();
              memz.thumbnailLink = this.domSanitizer.bypassSecurityTrustUrl(thumbnailLink.href);
              let imageLink = await this.fileService
                .toDownloadLink(this.fileService.getDownloadUrl(memz.imageUploadId))
                .toPromise();
              memz.imageLink = this.domSanitizer.bypassSecurityTrustUrl(imageLink.href);
            }
          });
        })
      )
      .subscribe((page) => (this.memzPage = page));
  }

  get pageNumber() {
    return this?.memzPage?.pageable?.pageNumber + 1;
  }

  handle(events: ArtcodedNotification[]) {
    this.load();
  }

  shouldHandle(event: ArtcodedNotification): boolean {
    return (
      !event.seen &&
      (event.type === RegisteredEvent.MEMZ_SET_VISIBLE ||
        event.type === RegisteredEvent.MEMZ_ADDED ||
        event.type === RegisteredEvent.MEMZ_DELETED)
    );
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribe(this);
  }

  shouldMarkEventAsSeenAfterConsumed(): boolean {
    return true;
  }
}
