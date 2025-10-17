import { Component, HostListener, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-file-upload-page',
  standalone: false,
  templateUrl: './file-upload-page.component.html',
  styleUrl: './file-upload-page.component.scss',
})
export class FileUploadPageComponent implements OnInit {
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
    this.personalInfoService.me().subscribe((u) => {
      this.user = u;
      this.activeId = this.route.snapshot.params.name || 'home';
    });
    this.titleService.setTitle('Uploads');
  }
}
