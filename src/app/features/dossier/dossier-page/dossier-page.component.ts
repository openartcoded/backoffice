import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { User } from '@core/models/user';
import { PersonalInfoService } from '@core/service/personal.info.service';

@Component({
    selector: 'app-dossier-page',
    templateUrl: './dossier-page.component.html',
    styleUrls: ['./dossier-page.component.scss'],
    standalone: false
})
export class DossierPageComponent implements OnInit {
    activeId: string;
    user: User;
    demoMode: boolean;
    constructor(
        public route: ActivatedRoute,
        private personalInfoService: PersonalInfoService,

        private titleService: Title,
    ) { }

    ngOnInit(): void {
        this.titleService.setTitle('Dossiers');
        this.activeId = this.route.snapshot.params.name || 'open';
        this.personalInfoService.me().subscribe((u) => (this.user = u));
        this.personalInfoService.get().subscribe(p => this.demoMode = p.demoMode);
    }
}
