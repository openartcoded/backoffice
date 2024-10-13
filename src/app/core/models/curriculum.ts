import { FileUpload } from './file-upload';

export interface Curriculum {
  id?: string;
  experiences?: Experience[];
  skills?: Skill[];
  personalProjects?: PersonalProject[];
  scholarHistories?: ScholarHistory[];
  hobbies?: Hobby[];
  person?: Person;
  introduction?: string;
  freemarkerTemplateId?: string;
  updatedDate?: Date;
}

export interface CurriculumFreemarkerTemplate {
  id?: string;
  name?: string;
  templateUploadId?: string;
  template?: FileUpload;
  dateCreation?: string;
}

export interface Person {
  firstname?: string;
  lastname?: string;
  title?: string;
  phoneNumber?: string;
  birthdate?: Date;
  emailAddress?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  address?: string;
  website?: string;
}

export interface PersonalProject {
  name?: string;
  url?: string;
  description?: string;
}

export interface Skill {
  name: string;
  softSkill: boolean;
  hardSkill: boolean;
  tags: string[];
  priority?: number;
}

export interface Experience {
  uuid?: string;
  from: Date;
  to?: Date;
  current: boolean;
  title: string;
  description: string[];
  company: string;
}

export interface Hobby {
  title: string;
}

export interface ScholarHistory {
  from: Date;
  to?: Date;
  current: boolean;
  title: string;
  school: string;
}

export interface DownloadCvRequest {
  email: string;
  id?: string;
  phoneNumber?: string;
  htmlContent?: string;
  dailyRate?: boolean;
  availability?: boolean;
  dateReceived?: Date;
}
