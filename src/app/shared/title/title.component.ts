import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-title',
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.scss'],
    standalone: false
})
export class TitleComponent implements OnInit {
  @Input('title') title: string;
  @Input('noPaddingTop') noPaddingTop: boolean;
  @Input('uppercase') uppercase: boolean;
  @Input('titleClass') titleClass: string = 'h2';

  constructor() {}

  ngOnInit(): void {}
}
