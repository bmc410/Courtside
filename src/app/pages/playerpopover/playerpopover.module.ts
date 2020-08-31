import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerpopoverPageRoutingModule } from './playerpopover-routing.module';

import { PlayerpopoverPage } from './playerpopover.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlayerpopoverPageRoutingModule
  ],
  declarations: [PlayerpopoverPage]
})
export class PlayerpopoverPageModule {}
