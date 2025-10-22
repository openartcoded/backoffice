import { Component, OnDestroy, OnInit } from '@angular/core';
import { ScriptService } from '@core/service/script.service';
import { BrowserStorageService } from '@core/service/storage-service';
import { firstValueFrom, interval, Subscription } from 'rxjs';

@Component({
    selector: 'app-script-console',
    standalone: false,
    templateUrl: './script-console.component.html',
    styleUrl: './script-console.component.scss'
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
    constructor(private scriptService: ScriptService, private localStorage: BrowserStorageService) { }
    ngOnDestroy(): void {
        this.subscriptions.forEach(s => s.unsubscribe());
    }
    ngOnInit(): void {
        this.subscriptions.push(this.scriptService.getBindingsMeta().subscribe(b => {
            this.bindings = b;
        }));
        this.script = this.localStorage.get("script") || "";
        this.subscriptions.push(interval(5000).subscribe(() => {
            const s = this.script?.trim() || undefined;
            if (!s) {
                this.localStorage.remove("script");
            } else {
                this.localStorage.set("script", s);
            }

        }));

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

    get bindingEntries() { return Object.entries(this.bindings) }
}
