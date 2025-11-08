import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Label } from '@core/models/fee';
import { User } from '@core/models/user';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbNavModule, NgbDropdownModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { AutosizeModule } from 'ngx-autosize';
import { NgxFileDropModule } from 'ngx-file-drop';
import { SharedModule } from '@shared/shared.module';

@Component({
    selector: 'app-tag-form',
    templateUrl: './tag-form.component.html',
    styleUrls: ['./tag-form.component.scss'],

    standalone: true,
    imports: [NgbNavModule, NgxFileDropModule,
        SharedModule,
        RouterModule,
        NgbDropdownModule,
        FormsModule,
        CommonModule, NgbTooltipModule, FontAwesomeModule, ReactiveFormsModule, AutosizeModule]
})
export class TagFormComponent implements OnInit {
    @Input()
    tags: Label[];

    @Output()
    tagSubmitted: EventEmitter<Label> = new EventEmitter<Label>();

    @Input()
    selectedTag: string;

    @Input()
    isDisabled: boolean;
    @Input()
    hideCancelButton: boolean;
    @Input()
    user: User;
    get hasRoleAdmin(): boolean {
        return this.user.authorities.includes('ADMIN');
    }
    constructor() { }

    ngOnInit(): void { }

    submit() {
        if (!this.hasRoleAdmin) {
            return;
        }
        if (this.selectedTag) {
            const tag = this.tags.find((l) => l.id === this.selectedTag);
            this.tagSubmitted.emit(tag);
        } else {
            this.reset();
        }
    }

    reset() {
        this.tagSubmitted.emit(null);
    }
}
