import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpaceRoutingModule } from './space-routing.module';
import { SpaceComponent } from './space.component';


@NgModule({
  declarations: [SpaceComponent],
  imports: [
    CommonModule,
    SpaceRoutingModule
  ]
})
export class SpaceModule { }
