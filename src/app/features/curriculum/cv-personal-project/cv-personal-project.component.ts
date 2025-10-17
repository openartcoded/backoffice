import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { PersonalProject } from '@core/models/curriculum';
import { WindowRefService } from '@core/service/window.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { isPlatformBrowser } from '@angular/common';
import { UpdateCvPersonalProjectComponent } from '@feature/curriculum/update-cv-personal-project/update-cv-personal-project.component';

@Component({
  selector: 'app-cv-personal-project',
  templateUrl: './cv-personal-project.component.html',
  styleUrls: ['./cv-personal-project.component.scss'],
  standalone: false,
})
export class CvPersonalProjectComponent {
  @Input()
  personalProjects: PersonalProject[];

  @Output()
  personalProjectsUpdated: EventEmitter<PersonalProject[]> = new EventEmitter<PersonalProject[]>();

  constructor(
    private windowService: WindowRefService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: any,
  ) {}

  delete(index: number) {
    if (isPlatformBrowser(this.platformId)) {
      let resp = this.windowService.nativeWindow.confirm('Are you sure you want to delete this record? ');
      if (resp) {
        this.personalProjects.splice(index, 1);
        this.personalProjectsUpdated.emit(this.personalProjects);
      }
    }
  }

  edit(proj: PersonalProject, index: number) {
    const modal = this.modalService.open(UpdateCvPersonalProjectComponent, {
      size: 'lg',
    });
    modal.componentInstance.personalProject = proj;
    modal.componentInstance.personalProjectUpdated.subscribe((newProj) => {
      modal.close();
      if (index !== undefined && index !== null) {
        this.personalProjects.splice(index, 1);
      }
      this.personalProjects.push(newProj);
      this.personalProjectsUpdated.emit(this.personalProjects);
    });
  }

  add() {
    this.edit(
      {
        url: null,
        name: null,
        description: null,
      },
      null,
    );
  }
}
