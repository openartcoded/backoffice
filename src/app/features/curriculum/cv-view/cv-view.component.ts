import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CvService } from '@core/service/cv.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Meta, Title } from '@angular/platform-browser';
import {
  CurriculumFreemarkerTemplate,
  Experience,
  Hobby,
  Person,
  PersonalProject,
  ScholarHistory,
  Skill,
} from '@core/models/curriculum';
import { TemplateComponent } from '../template/template.component';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-cv-view',
  templateUrl: './cv-view.component.html',
  styleUrls: ['./cv-view.component.scss'],
})
export class CvViewComponent implements OnInit {
  skills: Skill[];
  person: Person;
  experiences: Experience[];
  hobbies: Hobby[];
  scholarHistories: ScholarHistory[];
  introduction: string;
  personalProjects: PersonalProject[];
  private cv;

  constructor(
    private titleService: Title,
    private modalService: NgbModal,
    private metaService: Meta,
    private cvService: CvService
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Curriculum Vitae - BITTICH NORDINE');
    this.metaService.updateTag({
      name: 'description',
      content: 'Nordine Bittich - Artcoded, my CV or curriculum vitae ',
    });
    this.loadCv();
  }

  downloadCv() {
    this.cvService.downloadAsAdmin();
  }

  async updateIntroduction(intro: string) {
    this.cv.introduction = intro;
    await firstValueFrom(this.cvService.updateCurriculum(this.cv));
    this.loadCv();
  }

  async updateExperiences($event: Experience[]) {
    this.cv.experiences = $event;
    this.experiences = null;
    await firstValueFrom(this.cvService.updateCurriculum(this.cv));
    this.loadCv();
  }

  async updatePersonalProjects($event: PersonalProject[]) {
    this.cv.personalProjects = $event;
    this.personalProjects = null;
    await firstValueFrom(this.cvService.updateCurriculum(this.cv));
    this.loadCv();
  }

  async updateSkills($event: Skill[]) {
    this.cv.skills = $event;
    this.skills = null;
    await firstValueFrom(this.cvService.updateCurriculum(this.cv));
    this.loadCv();
  }

  private loadCv() {
    this.cvService.getFullCurriculum().subscribe((cv) => {
      this.cv = cv;
      this.skills = cv.skills;
      this.introduction = cv.introduction;
      this.personalProjects = cv.personalProjects;
      this.person = cv.person;
      this.experiences = cv.experiences;
      this.hobbies = cv.hobbies;
      this.scholarHistories = cv.scholarHistories;
    });
  }

  async updateScholarHistories($event: ScholarHistory[]) {
    this.cv.scholarHistories = $event;
    this.scholarHistories = null;
    await firstValueFrom(this.cvService.updateCurriculum(this.cv));
    this.loadCv();
  }

  async updateHobbies($event: Hobby[]) {
    this.cv.hobbies = $event;
    this.hobbies = null;
    await firstValueFrom(this.cvService.updateCurriculum(this.cv));
    this.loadCv();
  }

  async updatePerson($event: Person) {
    this.cv.person = $event;
    this.person = null;
    await firstValueFrom(this.cvService.updateCurriculum(this.cv));
    this.loadCv();
  }
  async updateDefaultTemplate($event: CurriculumFreemarkerTemplate) {
    this.cv.freemarkerTemplateId = $event.id;
    await firstValueFrom(this.cvService.updateCurriculum(this.cv));
    this.loadCv();
  }

  templateModal() {
    const ngbModalRef = this.modalService.open(TemplateComponent, {
      size: 'lg',
    });
    ngbModalRef.componentInstance.templates$ = this.cvService.listTemplates();
    ngbModalRef.componentInstance.cv = this.cv;
    ngbModalRef.componentInstance.onSaveTemplate.subscribe(async (formData) => {
      ngbModalRef.close();
      await firstValueFrom(this.cvService.addTemplate(formData));
    });
    ngbModalRef.componentInstance.onTemplateSetAsDefault.subscribe(async (templ) => {
      ngbModalRef.close();
      await this.updateDefaultTemplate(templ);
    });
    ngbModalRef.componentInstance.onDeleteTemplate.subscribe(async (template) => {
      ngbModalRef.close();
      await firstValueFrom(this.cvService.deleteTemplate(template));
    });
  }
}
