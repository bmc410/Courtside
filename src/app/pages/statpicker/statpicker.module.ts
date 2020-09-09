import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StatpickerPageRoutingModule } from './statpicker-routing.module';

import { StatpickerPage } from './statpicker.page';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuModule,
    StatpickerPageRoutingModule
  ],
  declarations: [StatpickerPage]
})
export class StatpickerPageModule {}
