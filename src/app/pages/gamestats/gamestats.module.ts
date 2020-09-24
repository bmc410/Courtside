import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GamestatsPageRoutingModule } from './gamestats-routing.module';

import { GamestatsPage } from './gamestats.page';
import { MenuModule } from 'primeng/menu';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    MatTableModule,
    FormsModule,
    IonicModule,
    GamestatsPageRoutingModule
  ],
  declarations: [GamestatsPage]
})
export class GamestatsPageModule {}
