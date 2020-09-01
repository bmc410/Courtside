import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamdetailPageRoutingModule } from './teamdetail-routing.module';

import { TeamdetailPage } from './teamdetail.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TeamdetailPageRoutingModule
  ],
  declarations: [TeamdetailPage]
})
export class TeamdetailPageModule {}
