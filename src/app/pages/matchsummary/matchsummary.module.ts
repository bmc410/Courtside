import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchsummaryPageRoutingModule } from './matchsummary-routing.module';

import { MatchsummaryPage } from './matchsummary.page';
import { MenuModule } from 'primeng/menu';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    MatTableModule,
    FormsModule,
    IonicModule,
    MatchsummaryPageRoutingModule
  ],
  declarations: [MatchsummaryPage]
})
export class MatchsummaryPageModule {}
