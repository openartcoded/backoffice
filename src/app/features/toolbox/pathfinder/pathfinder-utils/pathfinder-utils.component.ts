import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { XPathService } from '@core/service/xpath.service';
import { Meta, Title } from '@angular/platform-browser';
import {JSONPath} from 'jsonpath-plus';
@Component({
  selector: 'app-pathfinder-utils',
  templateUrl: './pathfinder-utils.component.html',
  styleUrls: ['./pathfinder-utils.component.scss'],
})
export class PathfinderUtilsComponent implements OnInit {
  @Input()
  pathType: string;
  inputForm: FormGroup;
  result: string;
  options: any;
  defaultJson: string = `
  {
"store": {
  "book": [
    {
      "category": "reference",
      "author": "Nigel Rees",
      "title": "Sayings of the Century",
      "price": 8.95
    },
    {
      "category": "fiction",
      "author": "Evelyn Waugh",
      "title": "Sword of Honour",
      "price": 12.99
    },
    {
      "category": "fiction",
      "author": "Herman Melville",
      "title": "Moby Dick",
      "isbn": "0-553-21311-3",
      "price": 8.99
    },
    {
      "category": "fiction",
      "author": "J. R. R. Tolkien",
      "title": "The Lord of the Rings",
      "isbn": "0-395-19395-8",
      "price": 22.99
    }
  ],
  "bicycle": {
    "color": "red",
    "price": 19.95
  }
}
}`;
  defaultXml: string = `
  <store>
    <book>
        <category>reference</category>
        <author>Nigel Rees</author>
        <title>Sayings of the Century</title>
        <price>8.95</price>
    </book>
    <book>
        <category>fiction</category>
        <author>Evelyn Waugh</author>
        <title>Sword of Honour</title>
        <price>12.99</price>
    </book>
    <book>
        <category>fiction</category>
        <author>Herman Melville</author>
        <title>Moby Dick</title>
        <isbn>0-553-21311-3</isbn>
        <price>8.99</price>
    </book>
    <book>
        <category>fiction</category>
        <author>J. R. R. Tolkien</author>
        <title>The Lord of the Rings</title>
        <isbn>0-395-19395-8</isbn>
        <price>22.99</price>
    </book>
    <bicycle>
        <color>red</color>
        <price>19.95</price>
    </bicycle>
</store>
  `;
  defaultJsonPath: string = '$.store.book[*].author';
  defaultXmlPath: string = '/store/book/author';

  constructor(
    private fb: FormBuilder,
    private titleService: Title,
    private metaService: Meta,
    private xpathService: XPathService
  ) {}

  ngOnInit(): void {
    let type = this.pathType === 'application/json' ? 'JSON Path' : 'XPath';
    this.metaService.updateTag({
      name: 'description',
      content: `${type} Online`,
    });

    this.titleService.setTitle(`${type} online`);
    this.options = {
      theme: 'vs-light',
      language: this.pathType,
    };
    this.inputForm = this.fb.group(
      {
        expression: new FormControl(this.pathType === 'application/json' ? this.defaultJsonPath : this.defaultXmlPath, [
          Validators.required,
        ]),
        data: new FormControl(this.pathType === 'application/json' ? this.defaultJson : this.defaultXml, [
          Validators.required,
        ]),
      },
      {}
    );
  }

  submit() {
    try {
      if (this.pathType === 'application/json') {
        const json = JSON.parse(this.inputForm.controls.data.value);
        this.result = JSONPath(
          {
           path: this.inputForm.controls.expression.value,
           json
          }
        );
      } else {
        this.xpathService
          .evaluate(this.inputForm.controls.expression.value, this.inputForm.controls.data.value)
          .subscribe(
            (resp) => (this.result = resp),
            (err) => console.error(err)
          );
      }
    } catch (e) {
      console.error(e);
    }
  }
}
