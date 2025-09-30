import { Component, EventEmitter, Input, OnInit, Optional } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SettingsService } from '@core/service/settings.service';
import { MenuLink } from '@core/models/settings';
import { FileService } from '@core/service/file.service';
import { DateUtils } from '@core/utils/date-utils';
import { firstValueFrom } from 'rxjs';
import { User } from '@core/models/user';

@Component({
    selector: 'app-app-settings',
    templateUrl: './app-settings.component.html',
    styleUrls: ['./app-settings.component.scss'],
    standalone: false
})
export class AppSettingsComponent implements OnInit {
  @Input()
  menuLinks: MenuLink[];
  file: any;

  @Input()
  user: User;
  constructor(
    @Optional() public activeModal: NgbActiveModal,
    private fileService: FileService,
    private settingsService: SettingsService,
  ) { }

  ngOnInit(): void {
    this.load();
  }
  load() {
    this.settingsService.getMenuLinks().subscribe((menuLinks) => (this.menuLinks = menuLinks));
  }
  toggleMenuLinkVisibility(menuLink: MenuLink) {
    menuLink.show = !menuLink.show;
    this.settingsService.updateMenuLinks(menuLink).subscribe((m) => { });
  }

  import() {
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      const json: any = fileReader.result;
      this.settingsService.importAllMenuLinks(JSON.parse(json)).subscribe((value) => { });
    };
    fileReader.readAsText(this.file);
  }

  loadFile($event) {
    this.file = $event.target.files[0];
  }

  download(menuLinks: MenuLink[]) {
    this.fileService.createFile(
      JSON.stringify(menuLinks, null, 2),
      'menu' + DateUtils.getCurrentTime() + '.json',
      'application/json',
    );
  }

  async delete(menuLink: MenuLink) {
    await firstValueFrom(this.settingsService.deleteMenuLinkById(menuLink.id));
    this.load();
  }

  // todo do this on the backend....
  async flipPosition(menuLink: MenuLink, menuLinkBefore: MenuLink) {
    menuLinkBefore.order = menuLinkBefore.order + 1;
    menuLink.order = menuLink.order - 1;
    await Promise.all([
      firstValueFrom(this.settingsService.updateMenuLinks(menuLinkBefore)),
      firstValueFrom(this.settingsService.updateMenuLinks(menuLink)),
    ]);
    this.load();
  }

  sortByOrder() {
    return (a, b) => a.order - b.order;
  }
}
