import { Component, EventEmitter, OnInit, Optional } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '@core/service/settings.service';
import { Observable } from 'rxjs';
import { MenuLink } from '@core/models/settings';
import { FileService } from '@core/service/file.service';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-app-settings',
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss'],
})
export class AppSettingsComponent implements OnInit {
  menuLinks: MenuLink[];
  file: any;

  menuLinkUpdated: EventEmitter<MenuLink> = new EventEmitter<MenuLink>();

  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private settingsService: SettingsService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  toggleMenuLinkVisibility(menuLink: MenuLink) {
    menuLink.show = !menuLink.show;
    this.settingsService.updateMenuLinks(menuLink).subscribe((m) => {
      this.menuLinkUpdated.emit(m);
    });
  }

  import() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const json: any = fileReader.result;
      this.settingsService.importAllMenuLinks(JSON.parse(json)).subscribe((value) => {
        this.load();
        this.menuLinkUpdated.emit(null);
      });
    };
    fileReader.readAsText(this.file);
  }

  private load() {
    this.settingsService.getMenuLinks().subscribe(menuLinks => {
      this.menuLinks =menuLinks;
    });
  }

  loadFile($event) {
    this.file = $event.target.files[0];
  }

  download(menuLinks: MenuLink[]) {
    this.fileService.createFile(
      JSON.stringify(menuLinks, null, 2),
      'menu' + DateUtils.getCurrentTime() + '.json',
      'application/json'
    );
  }

  async flipPosition(menuLink: MenuLink, menuLinkBefore: MenuLink) {
    menuLinkBefore.order = menuLinkBefore.order + 1;
    menuLink.order = menuLink.order - 1;
    menuLinkBefore = await this.settingsService.updateMenuLinks(menuLinkBefore).toPromise();
    menuLink = await this.settingsService.updateMenuLinks(menuLink).toPromise();
    this.menuLinkUpdated.emit(null);
    this.load();
  }

  sortByOrder() {
    return (a, b) => a.order - b.order;
  }
}
