import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-toolbox-container',
  standalone: false,
  templateUrl: './toolbox-container.component.html',
  styleUrl: './toolbox-container.component.scss',
})
export class ToolboxContainerComponent implements OnInit {
  activeId: string = 'date';

  constructor() {}

  ngOnInit(): void {}
}
