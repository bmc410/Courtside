import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoreboardPageRoutingModule } from './scoreboard-routing.module';

import { ScoreboardPage } from './scoreboard.page';
import {DialogModule} from 'primeng/dialog';
import { MatTableModule } from '@angular/material/table';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    ButtonModule,
    TableModule,
    IonicModule,
    ScoreboardPageRoutingModule
  ],
  declarations: [ScoreboardPage]
})
export class ScoreboardPageModule {}
