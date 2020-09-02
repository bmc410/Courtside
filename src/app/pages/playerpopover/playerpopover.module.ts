import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlayerpopoverPageRoutingModule } from './playerpopover-routing.module';

import { PlayerpopoverPage } from './playerpopover.page';
import {ListboxModule} from 'primeng/listbox';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListboxModule,
    PlayerpopoverPageRoutingModule
  ],
  declarations: [PlayerpopoverPage]
})
export class PlayerpopoverPageModule {}
