import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerdetailPageRoutingModule } from './playerdetail-routing.module';

import { PlayerdetailPage } from './playerdetail.page';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    ReactiveFormsModule,
    IonicModule,
    PlayerdetailPageRoutingModule
  ],
  declarations: [PlayerdetailPage]
})
export class PlayerdetailPageModule {}
