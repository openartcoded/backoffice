import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalInfoService } from '@core/service/personal.info.service';
import { User } from '@core/models/user';

@Component({
  selector: 'app-fee-page',
  templateUrl: './fee-page.component.html',
  styleUrls: ['./fee-page.component.scss'],
  standalone: false,
})
export class FeePageComponent implements OnInit {
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
    this.titleService.setTitle('Expenses');
    this.personalInfoService.me().subscribe((u) => {
      this.user = u;
      this.activeId = this.route.snapshot.params.name || (!this.hasRoleAdmin ? 'processed' : 'unprocessed');
    });
    this.personalInfoService.get().subscribe((p) => (this.demoMode = p.demoMode));
  }
}
