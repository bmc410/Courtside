import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchPageRoutingModule } from './match-routing.module';

import { MatchPage } from './match.page';
import {MatSelectModule} from '@angular/material/select'
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import { PlayerlistPageModule } from '../playerlist/playerlist.module';
import { PlayerpickerPage } from '../playerpicker/playerpicker.page';

@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    IonicModule,
    MatchPageRoutingModule,
    MatSelectModule
  ],
  declarations: [MatchPage, PlayerpickerPage]
})
export class MatchPageModule {}
