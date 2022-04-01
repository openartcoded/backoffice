import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeeTag, FeeTagColor } from '@core/models/fee';

@Component({
  selector: 'app-tag-form',
  templateUrl: './tag-form.component.html',
  styleUrls: ['./tag-form.component.scss'],
})
export class TagFormComponent implements OnInit {
  @Input()
  tags: FeeTagColor[];

  @Output()
  tagSubmitted: EventEmitter<FeeTag> = new EventEmitter<FeeTag>();

  @Input()
  selectedTag: FeeTag;

  @Input()
  isDisabled: boolean;
  @Input()
  hideCancelButton: boolean;

  constructor() {}

  ngOnInit(): void {}

  submit() {
    this.tagSubmitted.emit(this.selectedTag);
  }

  reset() {
    this.tagSubmitted.emit(null);
  }
}
