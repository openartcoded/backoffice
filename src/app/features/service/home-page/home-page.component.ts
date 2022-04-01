import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ContactService } from '@core/service/contact.service';
import { FormContact } from '@core/models/form-contact';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
})
export class HomePageComponent implements OnInit {
  showToast: boolean;

  constructor(private http: HttpClient, private titleService: Title, private contactService: ContactService) {}

  ngOnInit() {
    this.titleService.setTitle('Services');
  }

  submit($event: FormContact) {
    this.contactService.submit($event).subscribe((dt) => {
      this.showToast = true;
      setTimeout(() => (this.showToast = false), 5000);
    });
  }
}
