import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerpickerPageRoutingModule } from './playerpicker-routing.module';

import { PlayerpickerPage } from './playerpicker.page';

@NgModule({
  imports: [
    
    FormsModule,
    CommonModule,
    IonicModule,
    PlayerpickerPageRoutingModule
  ],
  declarations: [PlayerpickerPage]
})
export class PlayerpickerPageModule {}
