import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { PostStatus, UnreadMessagesCounter } from '@core/models/post';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { ReportService } from '@core/service/report.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-posts-page',
  standalone: false,
  templateUrl: './posts-page.component.html',
  styleUrl: './posts-page.component.scss',
})
export class PostsPageComponent {
  activeId: string;
  fullScreen: boolean;
  user: User;
  demoMode: boolean;
  unreadCounters: UnreadMessagesCounter[];
  get hasRoleAdmin(): boolean {
    return this.user.authorities.includes('ADMIN');
  }
  @HostListener('document:keydown.escape', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (!this.modalService.hasOpenModals()) {
      this.fullScreen = false;
    }
  }
  constructor(
    public route: ActivatedRoute,
    private personalInfoService: PersonalInfoService,
    private reportService: ReportService,
    private modalService: NgbModal,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Bookmarks');
    this.personalInfoService.me().subscribe((u) => {
      this.user = u;
      this.activeId = this.route.snapshot.params.name || 'home';
    });
    this.personalInfoService.get().subscribe((p) => (this.demoMode = p.demoMode));
    this.reportService.unreadCount().subscribe((u) => (this.unreadCounters = u));
  }

  getCounterForStatus(ps: PostStatus) {
    return (
      this.unreadCounters
        ?.filter((u) => u.status === ps && this.user?.email === u.subscriber)
        ?.map((u) => u.counter)
        ?.reduce((sum, u) => sum + u, 0) ?? 0
    );
  }
}
