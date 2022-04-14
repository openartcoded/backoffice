import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Label } from '@core/models/fee';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss'],
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

  constructor() {}

  ngOnInit(): void {}

  submit() {
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
