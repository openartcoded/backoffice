import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigInitService } from '@init/config-init.service';
import { Observable } from 'rxjs';

// Rust/Tantivy returns an array of stored field values, not a Spring Page.
export interface FileSearchHit {
  file_name?: unknown;
  sheet_name?: unknown;
  cell_position?: unknown;
  cell_value?: unknown;
  cell_ctx?: unknown;
  [field: string]: unknown;
}

export interface FileIngestionEntry {
  digest: string;
  status: string;
  reason: string | null;
}

export interface FileSearchStats {
  discovered: number;
  indexed: number;
  skipped: number;
  pending: number;
  files: Record<string, FileIngestionEntry>;
}

@Injectable({ providedIn: 'root' })
export class FileSearchService {
  private readonly url: string;

  constructor(
    private http: HttpClient,
    config: ConfigInitService,
  ) {
    this.url = `${config.getConfig()['BACKEND_URL']}/api/file-search`;
  }

  stats(): Observable<FileSearchStats> {
    return this.http.get<FileSearchStats>(`${this.url}/stats`);
  }

  search(q: string, page: number, perPage: number): Observable<FileSearchHit[]> {
    const params = new HttpParams()
      .set('q', q)
      .set('page', String(page))
      .set('per_page', String(perPage))
      .set('query_type', 'fuzzySearch');
    return this.http.get<FileSearchHit[]>(`${this.url}/search`, { params });
  }
}
