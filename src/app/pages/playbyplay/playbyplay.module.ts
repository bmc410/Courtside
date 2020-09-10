import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlaybyplayPageRoutingModule } from './playbyplay-routing.module';

import { PlaybyplayPage } from './playbyplay.page';
import { MenuModule } from 'primeng/menu';
import { MatTableModule } from '@angular/material/table';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MenuModule,
    IonicModule,
    MatTableModule,
    PlaybyplayPageRoutingModule
  ],
  declarations: [PlaybyplayPage]
})
export class PlaybyplayPageModule {}
