import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { ReportService } from '@core/service/report.service';
import { Post, PostItType } from '@core/models/post';
import { PostIt } from '@core/models/postit';
import { interval, skip, Subscription } from 'rxjs';

import { ToastService } from '@core/service/toast.service';
@Component({
    selector: 'app-scrum-board',
    templateUrl: './scrum-board.component.html',
    styleUrls: ['./scrum-board.component.scss'],
    standalone: false,
})
export class ScrumBoardComponent implements OnInit, OnDestroy {
    @Input()
    height = "";
    autosave: Subscription;
    private lastSavedState: any = null;
    form: UntypedFormGroup;
    draggedGroup: UntypedFormGroup | null = null;
    draggedColumn: string | null = null;
    postitTypes = ['TODOS', 'IN_PROGRESS', 'DONE'] as PostItType[];
    @Input()
    post: Post;

    constructor(
        private fb: UntypedFormBuilder,
        private reportService: ReportService,
        private toastService: ToastService,
    ) {
        this.form = this.fb.group({
            TODOS: this.fb.array([]),
            IN_PROGRESS: this.fb.array([]),
            DONE: this.fb.array([]),
        });
    }

    ngOnInit() {
        this.prefillColumn('TODOS', this.post.todos || []);
        this.prefillColumn('IN_PROGRESS', this.post.inProgress || []);
        this.prefillColumn('DONE', this.post.done || []);

        this.lastSavedState = JSON.stringify({
            todos: this.getColumnControls('TODOS').map((g) => this.extractPostIt(g)),
            inProgress: this.getColumnControls('IN_PROGRESS').map((g) => this.extractPostIt(g)),
            done: this.getColumnControls('DONE').map((g) => this.extractPostIt(g)),
        });
        const secondsCounter = interval(60000).pipe(skip(1));
        this.autosave = secondsCounter.subscribe((_) => {
            this.updateFullBoard();
        });
    }

    ngOnDestroy(): void {
        this.autosave.unsubscribe();
    }
    private prefillColumn(column: PostItType, postIts: PostIt[]) {
        const formArray = this.getColumn(column);
        postIts.forEach((p) => {
            formArray.push(
                this.createPostIt(p.note || '', p.id || crypto.randomUUID(), p.creationDate || new Date(), column),
            );
        });
    }

    createPostIt(note = '', id: string | null, creationDate: Date | null, status: PostItType): UntypedFormGroup {
        return this.fb.group({
            id: [id],
            note: [note],
            status: [status],
            creationDate: [creationDate || new Date()],
        });
    }

    getColumn(column: PostItType): UntypedFormArray {
        return this.form.get(column) as UntypedFormArray;
    }

    getColumnControls(column: PostItType): UntypedFormGroup[] {
        return this.getColumn(column).controls as UntypedFormGroup[];
    }

    addPostIt(column: PostItType) {
        const newPostIt = this.createPostIt('', crypto.randomUUID(), new Date(), column);
        this.getColumn(column).push(newPostIt);
    }

    delete(group: UntypedFormGroup, column: PostItType) {
        const colArray = this.getColumn(column);
        const index = colArray.controls.indexOf(group);
        if (index > -1) {
            colArray.removeAt(index);
            this.updateFullBoard();
        }
    }

    onDragStart(event: DragEvent, group: UntypedFormGroup) {
        this.draggedGroup = group;
        event.dataTransfer?.setData('text/plain', '');
    }

    onDragOver(event: DragEvent, column: PostItType) {
        event.preventDefault();
        this.draggedColumn = column;
    }

    onDrop(event: DragEvent, newStatus: PostItType) {
        event.preventDefault();
        this.draggedColumn = null;
        if (!this.draggedGroup) return;

        const oldStatus = this.draggedGroup.get('status')?.value;
        if (oldStatus === newStatus) return;

        const oldArray = this.getColumn(oldStatus);
        const newArray = this.getColumn(newStatus);
        const index = oldArray.controls.indexOf(this.draggedGroup);

        if (index > -1) {
            oldArray.removeAt(index);
            this.draggedGroup.get('status')?.setValue(newStatus);
            newArray.push(this.draggedGroup);
            this.updateFullBoard();
        }

        this.draggedGroup = null;
    }

    saveOrUpdate() {
        this.updateFullBoard();
    }
    private updateFullBoard() {
        const payload = {
            todos: this.getColumnControls('TODOS').map((g) => this.extractPostIt(g)),
            inProgress: this.getColumnControls('IN_PROGRESS').map((g) => this.extractPostIt(g)),
            done: this.getColumnControls('DONE').map((g) => this.extractPostIt(g)),
        };
        const jsonPayload = JSON.stringify(payload);
        if (jsonPayload === this.lastSavedState) {
            return;
        }
        this.reportService.updatePostIts(this.post.id, payload).subscribe((p) => {
            this.lastSavedState = {
                todos: p.todos || [],
                inProgress: p.inProgress || [],
                done: p.done || [],
            };
            this.post = p;
            this.toastService.showSuccess('board updated');
        });
    }
    private extractPostIt(g: UntypedFormGroup): PostIt {
        return {
            id: g.get('id')?.value,
            note: g.get('note')?.value,
            creationDate: g.get('creationDate')?.value,
        };
    }
}
