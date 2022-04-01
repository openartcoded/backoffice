import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { PathfinderRoutingModule } from './pathfinder-routing.module';
import { PathfinderManipulationComponent } from './pathfinder-manipulation/pathfinder-manipulation.component';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { PathfinderUtilsComponent } from './pathfinder-utils/pathfinder-utils.component';
import { AutosizeModule } from 'ngx-autosize';

@NgModule({
  declarations: [PathfinderManipulationComponent, PathfinderUtilsComponent],
  imports: [CommonModule, SharedModule, PathfinderRoutingModule, NgbNavModule, ReactiveFormsModule, AutosizeModule],
})
export class PathfinderModule {}
