import { Component } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, UntypedFormArray } from '@angular/forms';

@Component({
    selector: 'app-scrum-board',
    templateUrl: './scrum-board.component.html',
    styleUrls: ['./scrum-board.component.scss'],
    standalone: false,
})
export class ScrumBoardComponent {
    form: UntypedFormGroup;
    draggedGroup: UntypedFormGroup | null = null;
    draggedColumn: string | null = null;
    constructor(private fb: UntypedFormBuilder) {
        this.form = this.fb.group({
            TODOS: this.fb.array([this.createPostIt('First note', 'TODOS')]),
            IN_PROGRESS: this.fb.array([this.createPostIt('Second note', 'IN_PROGRESS')]),
            DONE: this.fb.array([this.createPostIt('Final note', 'DONE')])
        });
    }

    createPostIt(note = '', status = 'TODOS'): UntypedFormGroup {
        return this.fb.group({
            id: [null],
            note: [note],
            status: [status],
            updatedOn: [new Date()]
        });
    }

    getColumn(column: string): UntypedFormArray {
        return this.form.get(column) as UntypedFormArray;
    }

    addPostIt(column: string) {
        this.getColumn(column).push(this.createPostIt('', column));
    }

    delete(group: UntypedFormGroup, column: string) {
        const colArray = this.getColumn(column);
        const index = colArray.controls.indexOf(group);
        if (index > -1) colArray.removeAt(index);
    }

    onDragStart(event: DragEvent, group: UntypedFormGroup) {
        this.draggedGroup = group;
        event.dataTransfer?.setData('text/plain', '');
    }

    onDragOver(event: DragEvent, column: string) {
        event.preventDefault();
        this.draggedColumn = column;
    }
    getColumnControls(column: string): UntypedFormGroup[] {
        return (this.getColumn(column).controls as UntypedFormGroup[]);
    }
    onDrop(event: DragEvent, newStatus: string) {
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
        }
        this.draggedGroup = null;
    }

    saveOrUpdate(group: UntypedFormGroup) {
        console.log('Save or update', group.value);
        group.get('updatedOn')?.setValue(new Date());
    }
}
