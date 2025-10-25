import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolboxContainerComponent } from './toolbox-container/toolbox-container.component';
import { SharedModule } from '@shared/shared.module';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DateUtilsModule } from './dateutils/dateutils.module';
import { PathfinderModule } from './pathfinder/pathfinder.module';
import { RdfModule } from './rdf/rdf.module';
import { Base64UtilsModule } from './base64utils/base64utils.module';

@NgModule({
  declarations: [ToolboxContainerComponent],
  imports: [CommonModule, DateUtilsModule, PathfinderModule, RdfModule, Base64UtilsModule, SharedModule, NgbNavModule],
  exports: [ToolboxContainerComponent],
})
export class ToolBoxModule {}
