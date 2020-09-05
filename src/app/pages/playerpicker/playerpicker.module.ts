import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerpickerPageRoutingModule } from './playerpicker-routing.module';

import { PlayerpickerPage } from './playerpicker.page';

@NgModule({
  imports: [
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    IonicModule,
    PlayerpickerPageRoutingModule
  ],
  declarations: [PlayerpickerPage]
})
export class PlayerpickerPageModule {}
