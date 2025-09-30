import { Component, OnInit } from '@angular/core';
import { Script } from '@core/models/script';
import { ScriptService } from '@core/service/script.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-script',
    templateUrl: './script.component.html',
    styleUrls: ['./script.component.scss'],
    standalone: false
})
export class ScriptComponent implements OnInit {
  $scripts: Observable<Script[]>;
  constructor(private scriptService: ScriptService) {

  }
  ngOnInit(): void {
    this.$scripts = this.scriptService.getLoadedScripts();
  }

}
