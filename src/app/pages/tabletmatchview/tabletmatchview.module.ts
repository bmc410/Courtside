import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TabletmatchviewPageRoutingModule } from './tabletmatchview-routing.module';

import { TabletmatchviewPage } from './tabletmatchview.page';
import { PlayerComponent } from '../player/player.component';
import { PlayerpickerPageModule } from '../playerpicker/playerpicker.module';
import { MenuModule } from 'primeng/menu';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MenuModule,
    //PlayerpickerPageModule,
    TabletmatchviewPageRoutingModule,
  ],
  declarations: [TabletmatchviewPage, PlayerComponent]
})
export class TabletmatchviewPageModule {}
