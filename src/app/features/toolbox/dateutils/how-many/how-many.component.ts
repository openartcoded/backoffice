import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { DateInFutureValidator } from '@core/validators/date-in-future.validator';
import { DateInPastValidator } from '@core/validators/date-in-past.validator';
import { formatDate } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { DateUtils } from '@core/utils/date-utils';

@Component({
  selector: 'app-how-many',
  templateUrl: './how-many.component.html',
  styleUrls: ['./how-many.component.scss'],
})
export class HowManyComponent implements OnInit {
  howManyForm: UntypedFormGroup;
  result: number;
  resultStmt: string;

  @Input()
  beforeType: boolean;

  typeOptions: string[] = ['days', 'months', 'years'];

  constructor(private fb: UntypedFormBuilder, private titleService: Title, private metaService: Meta) {}

  ngOnInit(): void {
    let type = this.beforeType ? 'before' : 'since';
    this.titleService.setTitle(`How many days ${type} a certain date`);
    this.metaService.updateTag({
      name: 'description',
      content: `How many days ${type} christmas?`,
    });

    this.howManyForm = this.fb.group(
      {
        sinceType: new UntypedFormControl('days', [Validators.required]),
        sinceDate: new UntypedFormControl(DateUtils.formatInputDate(DateUtils.now()), [Validators.required]),
      },
      {
        validators: this.beforeType ? DateInPastValidator('sinceDate') : DateInFutureValidator('sinceDate'),
      }
    );
  }

  get sinceType(): string {
    return this.howManyForm.get('sinceType').value;
  }

  get sinceDate(): string {
    return this.howManyForm.get('sinceDate').value;
  }

  submit() {
    this.result = null;
    this.resultStmt = null;
    let start = moment(this.sinceDate, 'YYYY-MM-DD');
    let end = moment();

    let duration = this.beforeType ? moment.duration(start.diff(end)) : moment.duration(end.diff(start));
    switch (this.sinceType) {
      case 'days':
        this.result = duration.asDays();
        break;
      case 'months':
        this.result = duration.asMonths();
        break;
      case 'years':
        this.result = duration.asYears();
        break;
    }
    let formatted = formatDate(this.sinceDate, 'dd/MM/yyyy', 'de');
    this.resultStmt = `${this.sinceType} ${this.beforeType ? 'before' : 'since'} ${formatted}`;
  }

  floor(result: number): number {
    return Math.floor(result);
  }
}
