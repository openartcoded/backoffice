import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EndpointComponent } from './endpoint/endpoint.component';
import { SparqlRoutingModule } from './sparql.routing.module';
import { SharedModule } from '@shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutosizeModule } from 'ngx-autosize';



@NgModule({
  declarations: [
    EndpointComponent
  ],
  imports: [
    CommonModule, 
    SparqlRoutingModule,
    SharedModule,
  ]
})
export class SparqlModule { }
