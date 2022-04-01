import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CvViewComponent } from './cv-view/cv-view.component';
import { SkillComponent } from './skill/skill.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExperienceComponent } from './experience/experience.component';
import { HobbyComponent } from './hobby/hobby.component';
import { EducationComponent } from './education/education.component';
import { SharedModule } from '@shared/shared.module';
import { CurriculumRoutingModule } from './curriculum-routing.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CvDownloadComponent } from './cv-download/cv-download.component';
import { AutosizeModule } from 'ngx-autosize';
import { CvDownloadRequestComponent } from './cv-download-request/cv-download-request.component';
import { CvEditorComponent } from './cv-editor/cv-editor.component';
import { NgbDropdownModule, NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { IntroductionComponent } from './introduction/introduction.component';
import { UpdateExperienceComponent } from './update-experience/update-experience.component';
import { UpdateSkillComponent } from './update-skill/update-skill.component';
import { ChipsModule } from 'primeng/chips';
import { UpdateEducationComponent } from './update-education/update-education.component';
import { UpdateHobbyComponent } from './update-hobby/update-hobby.component';
import { HighlightModule } from 'ngx-highlightjs';
import { CvPersonComponent } from './cv-person/cv-person.component';
import { UpdateCvPersonComponent } from './update-cv-person/update-cv-person.component';
import { CvPersonalProjectComponent } from './cv-personal-project/cv-personal-project.component';
import { UpdateCvPersonalProjectComponent } from './update-cv-personal-project/update-cv-personal-project.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { TemplateComponent } from './template/template.component';

@NgModule({
  declarations: [
    CvViewComponent,
    SkillComponent,
    ExperienceComponent,
    HobbyComponent,
    EducationComponent,
    CvDownloadComponent,
    CvDownloadRequestComponent,
    CvEditorComponent,
    IntroductionComponent,
    UpdateExperienceComponent,
    UpdateSkillComponent,
    UpdateEducationComponent,
    UpdateHobbyComponent,
    CvPersonComponent,
    UpdateCvPersonComponent,
    CvPersonalProjectComponent,
    UpdateCvPersonalProjectComponent,
    TemplateComponent,
  ],
  exports: [],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    CurriculumRoutingModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    AutosizeModule,
    NgbDropdownModule,
    NgbNavModule,
    ChipsModule,
    NgxFileDropModule,
    HighlightModule,
  ],
})
export class CurriculumModule {}
