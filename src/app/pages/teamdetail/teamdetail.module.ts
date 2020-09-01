import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamdetailPageRoutingModule } from './teamdetail-routing.module';

import { TeamdetailPage } from './teamdetail.page';
import {TableModule} from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TableModule,
    TeamdetailPageRoutingModule
  ],
  declarations: [TeamdetailPage]
})
export class TeamdetailPageModule {}
