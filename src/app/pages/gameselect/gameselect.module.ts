import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GameselectPageRoutingModule } from './gameselect-routing.module';

import { GameselectPage } from './gameselect.page';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    IonicModule,
    GameselectPageRoutingModule
  ],
  declarations: [GameselectPage]
})
export class GameselectPageModule {}
