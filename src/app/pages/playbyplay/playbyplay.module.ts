import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaybyplayPageRoutingModule } from './playbyplay-routing.module';

import { PlaybyplayPage } from './playbyplay.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlaybyplayPageRoutingModule
  ],
  declarations: [PlaybyplayPage]
})
export class PlaybyplayPageModule {}
