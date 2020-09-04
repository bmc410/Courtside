import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchdetailPageRoutingModule } from './matchdetail-routing.module';

import { MatchdetailPage } from './matchdetail.page';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import {SelectButtonModule} from 'primeng/selectbutton';
import { GameselectPage } from '../gameselect/gameselect.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MenuModule,
    DropdownModule,
    DialogModule,
    IonicModule,
    SelectButtonModule,
    TableModule,
    MatchdetailPageRoutingModule
  ],
  declarations: [MatchdetailPage]
})
export class MatchdetailPageModule {}
