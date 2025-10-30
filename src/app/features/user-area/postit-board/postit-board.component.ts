import { Component, OnInit } from '@angular/core';
import { AbstractControl, UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PostItService } from '@core/service/post-it.service';
import { PostIt } from '@core/models/postit';
import { ToastService } from '@core/service/toast.service';

@Component({
  selector: 'app-postit-board',
  standalone: false,
  templateUrl: './postit-board.component.html',
  styleUrls: ['./postit-board.component.scss'],
})
export class PostitBoardComponent implements OnInit {
  getGroup(group: AbstractControl<any, any>): UntypedFormGroup {
    return group as UntypedFormGroup;
  }

  form!: UntypedFormArray;

  constructor(
    private postItService: PostItService,
    private toastService: ToastService,
    private fb: UntypedFormBuilder,
  ) {}

  ngOnInit(): void {
    this.form = this.fb.array([]);

    this.postItService.findAll().subscribe((postits) => {
      postits.forEach((p) => this.form.push(this.createPostItGroup(p)));
      this.addEmptyNote(); // toujours un champ vide dispo
    });
  }

  private createPostItGroup(postit?: PostIt): UntypedFormGroup {
    return this.fb.group({
      id: [postit?.id || null],
      note: [postit?.note || ''],
      updatedOn: [
        postit?.updatedDate ? new Date(postit.updatedDate) : postit?.creationDate ? new Date(postit.creationDate) : '',
      ],
    });
  }

  addEmptyNote(): void {
    this.form.push(this.createPostItGroup());
  }

  delete(index: number): void {
    const group = this.form.at(index) as UntypedFormGroup;
    const postIt = group.value as PostIt;

    if (!postIt.id) return;
    this.postItService.delete(postIt.id).subscribe((_) => {
      this.form.removeAt(index);
      this.toastService.showSuccess('postit removed');
    });
  }
  saveOrUpdate(index: number): void {
    const group = this.form.at(index) as UntypedFormGroup;
    const postIt = group.value as PostIt;

    if (!postIt.note.trim()) return;

    this.postItService.saveOrUpdate(postIt).subscribe((saved) => {
      group.patchValue({ id: saved.id, updatedOn: new Date(saved.updatedDate || saved.creationDate) });
      const isLast = index === this.form.length - 1;
      if (isLast) this.addEmptyNote();
      this.toastService.showSuccess('postit saved or updated');
    });
  }
}
