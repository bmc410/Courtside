import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndividualstatsPageRoutingModule } from './individualstats-routing.module';

import { IndividualstatsPage } from './individualstats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndividualstatsPageRoutingModule
  ],
  declarations: [IndividualstatsPage]
})
export class IndividualstatsPageModule {}
