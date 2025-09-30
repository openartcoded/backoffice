import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Person } from '@core/models/curriculum';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UpdateCvPersonComponent } from '@feature/curriculum/update-cv-person/update-cv-person.component';

@Component({
    selector: 'app-cv-person',
    templateUrl: './cv-person.component.html',
    styleUrls: ['./cv-person.component.scss'],
    standalone: false
})
export class CvPersonComponent {
  @Input()
  person: Person;

  @Output()
  personUpdated: EventEmitter<Person> = new EventEmitter<Person>();

  constructor(private modalService: NgbModal) {}

  edit() {
    const modal = this.modalService.open(UpdateCvPersonComponent, {
      size: 'lg',
    });
    modal.componentInstance.person = this.person;
    modal.componentInstance.personUpdated.subscribe((newPerson) => {
      modal.close();
      this.personUpdated.emit(newPerson);
    });
  }
}
