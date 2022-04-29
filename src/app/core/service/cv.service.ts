import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FileService } from '@core/service/file.service';
import { Curriculum, CurriculumFreemarkerTemplate, DownloadCvRequest } from '@core/models/curriculum';
import { ConfigInitService } from '@init/config-init.service';

@Injectable({
  providedIn: 'root',
})
export class CvService {
  basePath: string;
  constructor(private http: HttpClient, private fileService: FileService, private configService: ConfigInitService) {
    this.basePath = `${this.configService.getConfig()['BACKEND_URL']}/api/cv`;
  }

  public getCurriculum(): Observable<any> {
    return this.http.get<any>(`${this.basePath}`);
  }

  public getDownloadCvRequests(): Observable<DownloadCvRequest[]> {
    return this.http.post<DownloadCvRequest[]>(`${this.basePath}/download-requests`, {});
  }

  getFullCurriculum(): Observable<Curriculum> {
    return this.http.post<Curriculum>(`${this.basePath}/full`, {});
  }

  updateCurriculum(cv: any): Observable<Curriculum> {
    return this.http.post<any>(`${this.basePath}/update`, cv);
  }

  deleteDownloadRequest(cdr: DownloadCvRequest): Observable<any> {
    return this.http.delete<any>(`${this.basePath}/download-requests?id=${cdr.id}`);
  }

  downloadAsAdmin() {
    this.fileService.downloadLink(`${this.basePath}/admin-download`);
  }

  deleteTemplate(template: CurriculumFreemarkerTemplate) {
    return this.http.delete<any>(`${this.basePath}/delete-template?id=${template.id}`, {});
  }

  addTemplate(formData: FormData): Observable<CurriculumFreemarkerTemplate> {
    return this.http.post<CurriculumFreemarkerTemplate>(`${this.basePath}/add-template`, formData);
  }
  listTemplates(): Observable<CurriculumFreemarkerTemplate[]> {
    return this.http.get<CurriculumFreemarkerTemplate[]>(`${this.basePath}/list-templates`, {});
  }
}
