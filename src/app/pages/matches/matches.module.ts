import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatchesPageRoutingModule } from './matches-routing.module';

import { MatchesPage } from './matches.page';
import {TableModule} from 'primeng/table';
import {MatMenuModule} from '@angular/material/menu';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';
import {MatTableModule} from '@angular/material/table';
@NgModule({
  imports: [
    MenuModule,
    FormsModule,
    TableModule,
    CommonModule,
    IonicModule,
    MatTableModule,
    MatchesPageRoutingModule
  ],
  declarations: [MatchesPage]
})
export class MatchesPageModule {}
