import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import init, { html_to_rdfa, rdfa_to_turtle } from '@nbittich/web-rdfa/rdfa_wasm';
@Component({
  selector: 'app-rdfa',
  standalone: false,
  templateUrl: './rdfa.component.html',
  styleUrl: './rdfa.component.scss',
})
export class RdfaComponent implements OnInit {
  html: FormControl<string> = new FormControl('');
  out?: string;
  async ngOnInit() {
    await init('/assets/wasm/rdfa_wasm_bg.wasm');
  }

  htmlToTurtle() {
    this.out = rdfa_to_turtle(html_to_rdfa(this.html.value, '', ''));
  }
}
