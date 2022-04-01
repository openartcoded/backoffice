import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { UpdateSkillComponent } from '@feature/curriculum/update-skill/update-skill.component';
import { Skill } from '@core/models/curriculum';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.scss'],
})
export class SkillComponent implements OnInit {
  @Input()
  skills: Skill[];
  filteredSkills: Skill[];
  @Output()
  skillsUpdated: EventEmitter<Skill[]> = new EventEmitter<Skill[]>();

  filterSkill: string;

  constructor(
    private modalService: NgbModal,
    private windowService: WindowRefService,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    this.filteredSkills = this.skills;
  }

  compare(skill: Skill) {
    return (s) => skill.name !== s.name;
  }

  filter() {
    if (this?.filterSkill?.length < 2) {
      this.filteredSkills = this.skills;
    } else {
      let fsk = this.filterSkill.toUpperCase();
      this.filteredSkills = this.skills.filter(
        (skill) => skill.name.toUpperCase().includes(fsk) || skill.tags.find((tag) => tag.toUpperCase().includes(fsk))
      );
    }
  }

  add() {
    this.edit({
      priority: 0,
      name: null,
      hardSkill: true,
      softSkill: false,
      tags: [],
    });
  }

  delete(skill: Skill) {
    if (isPlatformBrowser(this.platformId)) {
      let resp = this.windowService.nativeWindow.confirm('Are you sure you want to delete this record? ');
      if (resp) {
        this.skillsUpdated.emit(this.skills.filter(this.compare(skill)));
      }
    }
  }

  edit(skill: Skill) {
    const modal = this.modalService.open(UpdateSkillComponent, { size: 'xl' });
    modal.componentInstance.skill = skill;
    modal.componentInstance.skillSubmitted.subscribe((newSkill) => {
      modal.close();
      const updatedSkills = this.skills.filter(this.compare(skill));
      updatedSkills.push(newSkill);
      this.skillsUpdated.emit(updatedSkills);
    });
  }
}
