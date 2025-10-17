import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedModule } from '@shared/shared.module';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-document-main-page',
  templateUrl: './document-main-page.component.html',
  standalone: false,
  styleUrl: './document-main-page.component.scss',
})
export class DocumentMainPageComponent {
  activeId: string;
  fullScreen: boolean;
  user: User;
  demoMode: boolean;
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
  }
}
