import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
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
  initialized: boolean;
  error: boolean;
  subscriptions: Subscription[] = [];
  formScript = new FormControl<string | null>(null);

  formUserScript: FormControl<UserScript | null>;
  bindings: [string, string][];
  userScripts: UserScript[] = [];
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
        this.bindings = Object.entries(b);
        this.subscriptions.push(
          this.scriptService.getUserScripts().subscribe((scripts) => {
            this.userScripts = scripts;
            this.formUserScript = new FormControl<UserScript | null>({
              value: null,
              disabled: !this.userScripts.length,
            });
            this.formScript.patchValue(this.localStorage.get('script') || '');
            this.subscriptions.push(
              interval(5000).subscribe(() => {
                const s = this.formScript?.value?.trim() || undefined;
                if (!s) {
                  this.localStorage.remove('script');
                } else {
                  this.localStorage.set('script', s);
                }
              }),
            );
            this.initialized = true;
          }),
        );
      }),
    );
  }

  async run() {
    try {
      this.error = false;
      this.out = await firstValueFrom(this.scriptService.run(this.formScript?.value));
    } catch (e) {
      this.out = e.error;
      this.error = true;
    }
  }

  saveScript() {
    const newScript: UserScript = { id: this.formUserScript.value?.id, content: this.formScript?.value };
    this.scriptService.saveUserScripts(newScript).subscribe((saved) => {
      const idx = this.userScripts.findIndex((s) => s.id === saved.id);
      if (idx >= 0) this.userScripts[idx] = saved;
      else this.userScripts.push(saved);
      this.formUserScript.reset({ value: saved, disabled: false });
    });
  }

  deleteScript() {
    if (!this.formUserScript.value) {
      console.log('no script selected');
      return;
    }
    this.scriptService.deleteUserScripts(this.formUserScript.value).subscribe(() => {
      this.userScripts = this.userScripts.filter((us) => us.id !== this.formUserScript.value.id);
      if (this.formUserScript.value?.id === this.formUserScript.value.id) this.formUserScript.patchValue(null);
      if (!this.userScripts.length) {
        this.formUserScript.reset({ value: null, disabled: true });
      }
    });
  }

  selectScript() {
    this.formScript.patchValue(this.formUserScript.value?.content);
  }
}
