import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchPageRoutingModule } from './match-routing.module';

import { MatchPage } from './match.page';
import {MatSelectModule} from '@angular/material/select'
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import { PlayerlistPageModule } from '../playerlist/playerlist.module';
import { PlayerpickerPage } from '../playerpicker/playerpicker.page';
import { ScoreboardPage } from '../scoreboard/scoreboard.page';
import {DialogModule} from 'primeng/dialog';
import { PlayerpickerPageModule } from '../playerpicker/playerpicker.module';
import {NumberPickerModule} from 'ng-number-picker';
import { MatDialog } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import {TableModule} from 'primeng/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    IonicModule,
    MatchPageRoutingModule,
    PlayerpickerPageModule,
    MatTableModule,
    MatSelectModule,
    //MatDialog,
    NumberPickerModule,
    DialogModule
  ],
  declarations: [MatchPage]
})
export class MatchPageModule {}
