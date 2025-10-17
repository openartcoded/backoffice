import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-image-loader',
  templateUrl: './image-loader.component.html',
  styleUrls: ['./image-loader.component.scss'],
  standalone: false,
})
export class ImageLoaderComponent implements OnInit {
  @Input() loader: string = '/assets/img/loader.gif';
  @Input() imageUrl: string;
  @Input() cssClass: string;

  isLoading: boolean;

  constructor() {}

  hideLoader() {
    this.isLoading = false;
  }

  ngOnInit(): void {
    this.isLoading = true;
  }
}
