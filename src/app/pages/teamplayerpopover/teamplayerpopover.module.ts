import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamplayerpopoverPageRoutingModule } from './teamplayerpopover-routing.module';

import { TeamplayerpopoverPage } from './teamplayerpopover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamplayerpopoverPageRoutingModule
  ],
  declarations: [TeamplayerpopoverPage]
})
export class TeamplayerpopoverPageModule {}
