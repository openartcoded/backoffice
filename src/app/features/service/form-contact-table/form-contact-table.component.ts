import { Component, OnInit } from '@angular/core';
import { ContactService } from '@core/service/contact.service';
import { Observable } from 'rxjs';
import { FormContact } from '@core/models/form-contact';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-form-contact-table',
    templateUrl: './form-contact-table.component.html',
    styleUrls: ['./form-contact-table.component.scss'],
    standalone: false
})
export class FormContactTableComponent implements OnInit {
  formContacts$: Observable<FormContact[]>;

  constructor(private contactService: ContactService, private titleService: Title) {}

  ngOnInit(): void {
    this.titleService.setTitle('Prospects');
    this.load();
  }

  delete(fc: FormContact) {
    this.contactService.delete(fc).subscribe((d) => this.load());
  }

  private load() {
    this.formContacts$ = this.contactService.findAll();
  }
}
