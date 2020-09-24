import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamestatsPage } from './gamestats.page';

const routes: Routes = [
  {
    path: '',
    component: GamestatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamestatsPageRoutingModule {}
