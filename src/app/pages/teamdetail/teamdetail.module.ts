import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TeamdetailPageRoutingModule } from './teamdetail-routing.module';

import { TeamdetailPage } from './teamdetail.page';
import {TableModule} from 'primeng/table';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {DropdownModule} from 'primeng/dropdown';
import {DialogModule} from 'primeng/dialog';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    DropdownModule,
    DialogModule,
    IonicModule,
    TableModule,
    TeamdetailPageRoutingModule
  ],
  declarations: [TeamdetailPage]
})
export class TeamdetailPageModule {}
