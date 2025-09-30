import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { WindowRefService } from '@core/service/window.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { UpdateEducationComponent } from '@feature/curriculum/update-education/update-education.component';
import { ScholarHistory } from '@core/models/curriculum';

@Component({
    selector: 'app-education',
    templateUrl: './education.component.html',
    styleUrls: ['./education.component.scss'],
    standalone: false
})
export class EducationComponent {
  @Input()
  scholarHistories: ScholarHistory[];

  @Output()
  scholarHistoriesUpdated: EventEmitter<ScholarHistory[]> = new EventEmitter<ScholarHistory[]>();

  constructor(
    private windowService: WindowRefService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  add() {
    this.edit({
      current: false,
      school: null,
      title: null,
      from: null,
      to: null,
    });
  }

  delete(hist: ScholarHistory) {
    if (isPlatformBrowser(this.platformId)) {
      let resp = this.windowService.nativeWindow.confirm('Are you sure you want to delete this record? ');
      if (resp) {
        this.scholarHistoriesUpdated.emit(this.scholarHistories.filter(this.compare(hist)));
      }
    }
  }

  compare(hist: ScholarHistory) {
    return (h) => h.school !== hist.school && hist.title !== h.title && hist.from !== h.from && hist.to !== h.to;
  }

  edit(hist: ScholarHistory) {
    const modal = this.modalService.open(UpdateEducationComponent, {
      size: 'xl',
    });
    modal.componentInstance.scholarHistory = hist;
    modal.componentInstance.scholarHistorySubmitted.subscribe((newHist) => {
      modal.close();
      const updated = this.scholarHistories.filter(this.compare(hist));
      updated.push(newHist);
      this.scholarHistoriesUpdated.emit(updated);
    });
  }
}
