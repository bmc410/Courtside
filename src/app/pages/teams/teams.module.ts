import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TeamsPageRoutingModule } from './teams-routing.module';
import { TeamsPage } from './teams.page';
import {TableModule} from 'primeng/table';
import {MatMenuModule} from '@angular/material/menu';
import {MenuModule} from 'primeng/menu';
import {MenuItem} from 'primeng/api';

@NgModule({
  imports: [
    CommonModule,
    MenuModule,
    FormsModule,
    IonicModule,
    TableModule,
    TeamsPageRoutingModule
  ],
  declarations: [TeamsPage]
})
export class TeamsPageModule {}
