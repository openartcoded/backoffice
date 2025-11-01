import { Component, HostListener, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';

@Component({
    selector: 'app-invoice-page',
    templateUrl: './invoice-page.component.html',
    styleUrls: ['./invoice-page.component.scss'],
    standalone: false,
})
export class InvoicePageComponent implements OnInit {
    activeId: string;
    fullScreen: boolean;
    user: User;
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
        private modalService: NgbModal,
        private titleService: Title,
        private personalInfoService: PersonalInfoService,
    ) { }

    ngOnInit(): void {
        this.titleService.setTitle('Invoices');
        this.personalInfoService.me().subscribe((u) => {
            this.user = u;
            this.activeId = this.route.snapshot.params.name || (!this.hasRoleAdmin ? 'processed' : 'bookmarked');
        });
    }
}
