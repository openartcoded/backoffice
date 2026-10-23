import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, finalize, forkJoin, map, of, Subscription, switchMap } from 'rxjs';
import { FileService } from '@core/service/file.service';
import { FileUpload } from '@core/models/file-upload';
import { FileSearchHit, FileSearchService, FileSearchStats } from '@core/service/file-search.service';

interface DisplayHit {
  fileName: string;
  sheet: string;
  position: string;
  context: string;
  content: string;
  expanded: boolean;
  upload: FileUpload | null;
}

@Component({
  selector: 'app-file-search-tab',
  standalone: false,
  templateUrl: './file-search-tab.component.html',
})
export class FileSearchTabComponent implements OnInit, OnDestroy {
  query = '';
  submittedQuery = '';
  page = 0; // Rust search endpoint uses zero-based offsets.
  readonly pageSize = 2;
  readonly snippetLength = 250;
  hits: DisplayHit[] = [];
  loading = false;
  searched = false;
  error = '';
  stats: FileSearchStats | null = null;
  statsLoading = false;
  statsError = '';
  showSkipped = false;
  private statsRequest?: Subscription;
  private request?: Subscription;

  constructor(
    private searchService: FileSearchService,
    private fileService: FileService,
  ) {}

  ngOnInit(): void {
    this.refreshStats();
  }

  get skippedFiles(): { name: string; reason: string }[] {
    if (!this.stats) return [];
    return Object.entries(this.stats.files ?? {})
      .filter(([, entry]) => entry.status === 'skipped')
      .map(([name, entry]) => ({ name, reason: entry.reason || 'No reason provided' }));
  }

  refreshStats(): void {
    this.statsRequest?.unsubscribe();
    this.statsLoading = true;
    this.statsError = '';
    this.statsRequest = this.searchService
      .stats()
      .pipe(finalize(() => (this.statsLoading = false)))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
        },
        error: () => {
          this.statsError = 'Unable to load ingestion statistics.';
        },
      });
  }

  // The index currently stores filenames, not upload IDs. Resolve only exact UUID
  // filenames through the authenticated upload API; never assume a filename is an ID.
  private uploadId(fileName: string): string | null {
    const match = /^([0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12})(?:\.[^.\/]+)?$/i.exec(
      fileName,
    );
    return match ? match[1] : null;
  }

  private resolveUploads(hits: DisplayHit[]) {
    if (!hits.length) return of(hits);
    return forkJoin(
      hits.map((hit) => {
        const id = this.uploadId(hit.fileName);
        if (!id) return of(hit);
        return this.fileService.findById(id).pipe(
          map((upload) => {
            if (upload?.id === id) {
              hit.upload = upload;
            }
            return hit;
          }),
          catchError(() => of(hit)),
        );
      }),
    );
  }

  download(hit: DisplayHit): void {
    if (hit.upload) this.fileService.download(hit.upload);
  }

  trackHit(_index: number, hit: DisplayHit): string {
    return `${hit.fileName}|${hit.sheet}|${hit.position}|${hit.content}`;
  }

  toggleExpanded(hit: DisplayHit): void {
    hit.expanded = !hit.expanded;
  }

  isLong(hit: DisplayHit): boolean {
    return hit.content.length > this.snippetLength;
  }

  snippet(hit: DisplayHit): string {
    if (hit.expanded || !this.isLong(hit)) return hit.content;
    return hit.content.slice(0, this.snippetLength).trimEnd() + '…';
  }

  private formatValue(value: unknown): string {
    // Tantivy NamedFieldDocument serializes each field as an array of typed values.
    if (Array.isArray(value)) {
      return value
        .map((item) => this.formatValue(item))
        .filter(Boolean)
        .join(', ');
    }
    if (value == null) return '';
    if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') return String(value);
    if (typeof value === 'object') {
      const obj = value as Record<string, unknown>;
      if ('Str' in obj) return this.formatValue(obj['Str']);
      if ('str' in obj) return this.formatValue(obj['str']);
      return JSON.stringify(value);
    }
    return '';
  }

  submit(): void {
    this.submittedQuery = this.query.trim();
    this.page = 0;
    if (!this.submittedQuery) {
      this.request?.unsubscribe();
      this.loading = false;
      this.searched = false;
      this.hits = [];
      this.error = '';
      return;
    }
    this.fetch();
  }

  fetch(): void {
    this.request?.unsubscribe();
    this.loading = true;
    this.error = '';
    // Keep the previous page visible until the new results have arrived.
    this.searched = true;
    this.request = this.searchService
      .search(this.submittedQuery, this.page, this.pageSize)
      .pipe(
        switchMap((results) => {
          if (!Array.isArray(results)) throw new Error('Unexpected response from file-search.');
          const hits: DisplayHit[] = results.map((hit: FileSearchHit) => ({
            fileName: this.formatValue(hit.file_name) || 'Unknown file',
            sheet: this.formatValue(hit.sheet_name),
            position: this.formatValue(hit.cell_position),
            context: this.formatValue(hit.cell_ctx),
            content: this.formatValue(hit.cell_value),
            expanded: false,
            upload: null,
          }));
          return this.resolveUploads(hits);
        }),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (hits) => (this.hits = hits),
        error: (err) => {
          this.hits = [];
          this.error =
            err.status === 502 || err.status === 503
              ? 'File search is currently unavailable.'
              : err.message === 'Unexpected response from file-search.'
                ? err.message
                : `Search failed (${err.status || 'network error'}).`;
        },
      });
  }

  previous(): void {
    if (this.loading || this.page === 0) return;
    this.page--;
    this.fetch();
  }

  next(): void {
    if (this.loading || this.hits.length < this.pageSize) return;
    this.page++;
    this.fetch();
  }

  ngOnDestroy(): void {
    this.request?.unsubscribe();
    this.statsRequest?.unsubscribe();
  }
}
