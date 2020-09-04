import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerlistPageRoutingModule } from './playerlist-routing.module';

import { PlayerlistPage } from './playerlist.page';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    MenuModule,
    IonicModule,
    PlayerlistPageRoutingModule
  ],
  declarations: [PlayerlistPage]
})
export class PlayerlistPageModule {}
