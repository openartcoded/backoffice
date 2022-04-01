import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateExperienceComponent } from '@feature/curriculum/update-experience/update-experience.component';
import { Experience } from '@core/models/curriculum';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss'],
})
export class ExperienceComponent implements OnInit {
  @Input()
  experiences: Experience[];

  @Output()
  experiencesUpdated: EventEmitter<Experience[]> = new EventEmitter<Experience[]>();

  filteredExperiences: Experience[];
  filterExperience: string;

  constructor(
    private windowService: WindowRefService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.filteredExperiences = this.experiences;
  }

  filter() {
    if (this?.filterExperience?.length < 2) {
      this.filteredExperiences = this.experiences;
    } else {
      let fxp = this.filterExperience.toUpperCase();
      this.filteredExperiences = this.experiences.filter(
        (xp) =>
          xp.title.toUpperCase().includes(fxp) ||
          xp.company.toUpperCase().includes(fxp) ||
          xp.description.find((des) => des.toUpperCase().includes(fxp))
      );
    }
  }

  delete(exp: Experience) {
    if (isPlatformBrowser(this.platformId)) {
      let resp = this.windowService.nativeWindow.confirm('Are you sure you want to delete this record? ');
      if (resp) {
        this.experiencesUpdated.emit(this.experiences.filter(this.compare(exp)));
      }
    }
  }

  edit(exp: Experience) {
    const modal = this.modalService.open(UpdateExperienceComponent, {
      size: 'xl',
    });
    modal.componentInstance.experience = exp;
    modal.componentInstance.experienceSubmitted.subscribe((newExp) => {
      modal.close();
      const updatedExperiences = this.experiences.filter(this.compare(exp));
      updatedExperiences.push(newExp);
      this.experiencesUpdated.emit(updatedExperiences);
    });
  }

  compare(exp) {
    return (e) =>
      e.title !== exp.title &&
      e.description !== exp.description &&
      e.company !== exp.company &&
      e.from !== exp.from &&
      e.to !== exp.to;
  }

  add() {
    this.edit({
      current: false,
      company: null,
      title: null,
      from: null,
      to: null,
      description: [],
    });
  }
}
