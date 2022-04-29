import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { FeeService } from '@core/service/fee.service';
import { Fee, FeeSearchCriteria, Label } from '@core/models/fee';
import { Page } from '@core/models/page';
import { DossierService } from '@core/service/dossier.service';
import { Dossier } from '@core/models/dossier';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FeeDetailComponent } from '../fee-detail/fee-detail.component';
import { FeeProcessValidationComponent } from '../fee-process-validation/fee-process-validation.component';
import { WindowRefService } from '@core/service/window.service';
import { isPlatformBrowser } from '@angular/common';
import { ManualSubmitComponent } from '../manual-submit/manual-submit.component';
import { OnApplicationEvent, RegisteredEvent } from '@core/interface/on-application-event';
import { ArtcodedNotification } from '@core/models/artcoded.notification';
import { NotificationService } from '@core/service/notification.service';
import { LabelService } from '@core/service/label.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-fee-table-result',
  templateUrl: './fee-table-result.component.html',
  styleUrls: ['./fee-table-result.component.scss'],
})
export class FeeTableResultComponent implements OnInit, OnApplicationEvent {
  @Input()
  archived: boolean;
  searchCriteria: FeeSearchCriteria;
  fees: Page<Fee>;
  pageSize: number = 5;

  tags: Label[];

  selectedRows: Fee[] = [];

  showTagForm: boolean;
  activeDossier: Dossier;

  constructor(
    private dossierService: DossierService,
    private modalService: NgbModal,
    @Inject(PLATFORM_ID) private platformId: any,
    private windowRefService: WindowRefService,
    private notificationService: NotificationService,
    private labelService: LabelService,
    private feeService: FeeService
  ) {}

  ngOnInit(): void {
    this.dossierService.activeDossier().subscribe((dt) => (this.activeDossier = dt));
    if (!this.archived) {
      this.notificationService.subscribe(this);
    }
    this.search({
      archived: this.archived,
    });
    this.labelService.findAll().subscribe((labels) => (this.tags = labels));
  }

  search(criteria: FeeSearchCriteria) {
    this.searchCriteria = criteria;
    this.selectedRows = [];
    this.load();
  }

  load(event: number = 1) {
    this.feeService.search(this.searchCriteria, event, this.pageSize).subscribe((data) => {
      this.fees = data;
    });
  }

  get pageNumber() {
    return this?.fees?.pageable?.pageNumber + 1;
  }

  toggleSelectedRow(fee: Fee, force = false, evt = null) {
    evt?.stopPropagation();
    if (this.isFeeSelected(fee) || force) {
      this.selectedRows = this.selectedRows.filter((f) => f.id !== fee.id);
    } else {
      this.selectedRows.push(fee);
    }
  }

  toggleAllRows(toggle, fees: Fee[]) {
    if (toggle?.target?.checked) {
      this.selectedRows = [...this.selectedRows, ...fees];
    } else {
      fees.forEach((f) => this.toggleSelectedRow(f, true));
    }
  }

  isFeeSelected(fee: Fee) {
    return this.selectedRows.some((f) => f.id === fee.id);
  }

  isAllFeesSelected(content: Fee[]) {
    return content.every((r) => this.selectedRows.some((x) => x.id === r.id));
  }

  getStyleForTag(f: Fee) {
    const label = this.tags.find((l) => l.name === f.tag);
    if (!label) {
      return { color: '#FFFFFF' };
    }
    return { color: label.colorHex };
  }

  getStyleForLabel(label: Label) {
    return { color: label.colorHex };
  }

  saveTag($event: Label) {
    this.showTagForm = false;
    if (!$event) {
      return;
    }
    let tagIds = this.selectedRows.map((r) => r.id);
    this.feeService.updateTag(tagIds, $event).subscribe((data) => {
      this.search(this.searchCriteria);
    });
  }

  openDetail(f: Fee) {
    this.toggleAllRows(null, this.fees.content);
    const modalRef = this.modalService.open(FeeDetailComponent, {
      size: 'xl',
      scrollable: true,
    });
    modalRef.componentInstance.fee = f;
    modalRef.componentInstance.feeUpdated.subscribe((f) => {
      this.load();
    });
  }

  filterByTag(t: Label) {
    const criteria = {
      tag: t.name,
      archived: this.archived,
    } as FeeSearchCriteria;
    this.search(criteria);
  }

  openProcessValidation() {
    const modalRef = this.modalService.open(FeeProcessValidationComponent);
    modalRef.componentInstance.selectedFees = this.selectedRows;
    modalRef.componentInstance.labels = this.tags;
    modalRef.componentInstance.activeDossier = this.activeDossier;
    modalRef.componentInstance.selectedFeeRemoved.subscribe((f) => {
      this.toggleSelectedRow(f, true);
      if (this.selectedRows.length === 0) {
        modalRef.close();
      }
    });
    modalRef.componentInstance.processValidated.subscribe((fees) => {
      this.dossierService.processFees(fees.map((f) => f.id)).subscribe((dt) => {
        modalRef.close();
        this.selectedRows = [];
        this.load();
      });
    });
  }

  async deleteFees() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.windowRefService.nativeWindow.confirm('Are you sure you want to delete the selected fees?')) {
        for (const fee of this.selectedRows) {
          await firstValueFrom(this.feeService.delete(fee));
        }
        this.search(this.searchCriteria);
      }
    }
  }

  manualSubmit() {
    const modalRef = this.modalService.open(ManualSubmitComponent, {
      size: 'lg',
    });
    //manualFormSubmitted
    modalRef.componentInstance.manualFormSubmitted.subscribe((form) => {
      modalRef.close();
      this.feeService.manualSubmit(form).subscribe((fee) => {
        this.selectedRows = [];
        this.load();
      });
    });
  }

  handle(events: ArtcodedNotification[]) {
    this.load();
  }

  ngOnDestroy(): void {
    this.notificationService.unsubscribe(this);
  }

  shouldHandle(event: ArtcodedNotification): boolean {
    return !event.seen && event.type === RegisteredEvent.NEW_FEE;
  }

  shouldMarkEventAsSeenAfterConsumed(): boolean {
    return true;
  }
}
