import { Component, EventEmitter, Inject, Input, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { WindowRefService } from '@core/service/window.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateHobbyComponent } from '@feature/curriculum/update-hobby/update-hobby.component';
import { Hobby } from '@core/models/curriculum';

@Component({
    selector: 'app-hobby',
    templateUrl: './hobby.component.html',
    styleUrls: ['./hobby.component.scss'],
    standalone: false
})
export class HobbyComponent implements OnInit {
  @Input()
  hobbies: Hobby[];

  @Output()
  hobbiesUpdated: EventEmitter<Hobby[]> = new EventEmitter<Hobby[]>();

  constructor(
    private windowService: WindowRefService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {}

  edit() {
    const modal = this.modalService.open(UpdateHobbyComponent, { size: 'xl' });
    modal.componentInstance.hobbies = this.hobbies;
    modal.componentInstance.hobbiesSubmitted.subscribe((newHobbies) => {
      modal.close();
      this.hobbiesUpdated.emit(newHobbies);
    });
  }
}
