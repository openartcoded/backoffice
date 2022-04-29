import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { firstValueFrom, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

@Injectable()
export class ConfigInitService {
  private config: any;

  constructor(private httpClient: HttpClient) {}

  async load() {
    await firstValueFrom(this.loadConfig());
    return this.config;
  }

  public getConfig() {
    return this.config;
  }

  private loadConfig(): Observable<any> {
    return this.httpClient
      .get(this.getConfigFile(), {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response && response.body) {
            this.config = response.body;
            return of(this.config);
          } else {
            return of(null);
          }
        })
      );
  }

  private getConfigFile(): string {
    return environment.configFile;
  }
}
