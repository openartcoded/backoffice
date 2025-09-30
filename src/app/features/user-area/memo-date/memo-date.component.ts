import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { MemoDateService } from '@core/service/memo-date.service';
import { MemoDate } from '@core/models/memo-date';
import moment from 'moment';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MemoDateFormComponent } from '../memo-date-form/memo-date-form.component';
import { ToastService } from '@core/service/toast.service';

@Component({
    selector: 'app-memo-date',
    templateUrl: './memo-date.component.html',
    styleUrls: ['./memo-date.component.scss'],
    standalone: false
})
export class MemoDateComponent implements OnInit {
    memoDates: MemoDate[];
    progresses = [
        {
            label: '1d',
            value: 1,
            computedWidth: 25,
        },
        {
            label: '2d',
            value: 2,
            computedWidth: 25,
        },
        {
            label: '1w',
            value: 7,
            computedWidth: 25,
        },
        {
            label: '2w',
            value: 15,
            computedWidth: 25,
        },
        {
            label: '1m',
            value: 30,
            computedWidth: 25,
        },
        {
            label: '2m',
            value: 60,
            computedWidth: 25,
        },
        {
            label: '3m',
            value: 90,
            computedWidth: 25,
        },
        {
            label: '6m',
            value: 183,
            computedWidth: 25,
        },
        {
            label: '1y',
            value: 365,
            computedWidth: 25,
        },
        {
            label: '2y',
            value: 365 * 2,
            computedWidth: 25,
        },
        {
            label: '3y',
            value: 365 * 3,
            computedWidth: 25,
        },
        {
            label: '4y',
            value: 365 * 4,
            computedWidth: 25,
        },
        {
            label: '5y',
            value: 365 * 5,
            computedWidth: 25,
        },
    ];

    constructor(
        private memoService: MemoDateService,
        private windowRefService: WindowRefService,
        private modalService: NgbModal,
        private toastService: ToastService,
        @Inject(PLATFORM_ID) private platformId: any
    ) { }

    ngOnInit(): void {
        this.reload();
    }

    reload() {
        this.memoService
            .findAll()
            .pipe(map((memos) => memos.map((memo) => this.getProgresses(memo))))
            .subscribe((memoDates) => (this.memoDates = memoDates));
    }

    add(memoDate: MemoDate) {
        this.memoService.save(memoDate).subscribe((dt) => {
            this.reload();
        });
    }

    getProgresses(memo: MemoDate) {
        let start = moment(memo.dateSince);
        let end = moment();

        let days = moment.duration(end.diff(start)).asDays();
        let currentProgress = 100;
        let nextProgress = this.progresses.find((p) => p.value > days);
        let currentProgressStars = this.progresses.filter((p) => p.value <= days);
        if (nextProgress) {
            currentProgress = (days / nextProgress.value) * 100;
        }
        memo.progresses = {
            currentProgress: {
                label: Math.floor(days),
                currentProgressStars: currentProgressStars,
                computedWidth: Math.floor(currentProgress),
            },
            nextProgress: nextProgress,
        };
        return memo;
    }

    delete(memo: MemoDate) {
        if (isPlatformBrowser(this.platformId)) {
            if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete the memo?')) {
                this.memoService.delete(memo).subscribe((m) => {
                    this.reload();
                    this.toastService.showSuccess('Memo deleted');
                });
            }
        }
    }

    showAddForm() {
        let modalRef = this.modalService.open(MemoDateFormComponent, {});
        modalRef.componentInstance.addMemo.subscribe((memo) => {
            this.add(memo);
            this.toastService.showSuccess('Memo saved');
            modalRef.close();
        });
    }
}
