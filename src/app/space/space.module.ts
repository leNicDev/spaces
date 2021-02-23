import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpaceRoutingModule } from './space-routing.module';
import { SpaceComponent } from './space.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SpaceComponent],
  imports: [
    CommonModule,
    SpaceRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class SpaceModule { }
