import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScoremodalPageRoutingModule } from './scoremodal-routing.module';

import { ScoremodalPage } from './scoremodal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScoremodalPageRoutingModule
  ],
  declarations: [ScoremodalPage]
})
export class ScoremodalPageModule {}
