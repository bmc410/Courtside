import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IndividualstatsPageRoutingModule } from './individualstats-routing.module';

import { IndividualstatsPage } from './individualstats.page';
import { MenuModule } from 'primeng/menu';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    MatTableModule,
    IonicModule,
    IndividualstatsPageRoutingModule
  ],
  declarations: [IndividualstatsPage]
})
export class IndividualstatsPageModule {}
