import { Component, OnDestroy, OnInit } from '@angular/core';
import { UserScript } from '@core/models/script';
import { ScriptService } from '@core/service/script.service';
import { BrowserStorageService } from '@core/service/storage-service';
import { firstValueFrom, interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-script-console',
  standalone: false,
  templateUrl: './script-console.component.html',
  styleUrl: './script-console.component.scss',
})
export class ScriptConsoleComponent implements OnInit, OnDestroy {
  placeholder = `
 let dossiers = dossierService.findAll(true)
 let ids = []
 for(const dossier of dossiers) {
    ids.push(dossier.getId())
 }
 JSON.stringify(ids)`.trim();
  out: string;
  error: boolean;
  subscriptions: Subscription[] = [];
  script: string;
  bindings: Record<string, string>;
  userScripts: UserScript[] = [];
  selectedScript: UserScript | null = null;
  constructor(
    private scriptService: ScriptService,
    private localStorage: BrowserStorageService,
  ) {}
  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
  ngOnInit(): void {
    this.subscriptions.push(
      this.scriptService.getBindingsMeta().subscribe((b) => {
        this.bindings = b;
      }),
    );
    this.subscriptions.push(
      this.scriptService.getUserScripts().subscribe((scripts) => {
        this.userScripts = scripts;
      }),
    );
    this.script = this.localStorage.get('script') || '';
    this.subscriptions.push(
      interval(5000).subscribe(() => {
        const s = this.script?.trim() || undefined;
        if (!s) {
          this.localStorage.remove('script');
        } else {
          this.localStorage.set('script', s);
        }
      }),
    );
  }

  async run() {
    try {
      this.error = false;
      this.out = await firstValueFrom(this.scriptService.run(this.script));
    } catch (e) {
      this.out = e.error;
      this.error = true;
    }
  }

  get bindingEntries() {
    return Object.entries(this.bindings);
  }

  saveScript() {
    const newScript: UserScript = { id: this.selectedScript?.id, content: this.script };
    this.scriptService.saveUserScripts(newScript).subscribe((saved) => {
      const idx = this.userScripts.findIndex((s) => s.id === saved.id);
      if (idx >= 0) this.userScripts[idx] = saved;
      else this.userScripts.push(saved);
      this.selectedScript = saved;
    });
  }

  deleteScript(s: UserScript) {
    this.scriptService.deleteUserScripts(s).subscribe(() => {
      this.userScripts = this.userScripts.filter((us) => us.id !== s.id);
      if (this.selectedScript?.id === s.id) this.selectedScript = undefined;
    });
  }

  selectScript(s: UserScript) {
    this.selectedScript = s;
    this.script = s.content;
  }
}
