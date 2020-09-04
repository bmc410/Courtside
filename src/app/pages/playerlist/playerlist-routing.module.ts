import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerlistPage } from './playerlist.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerlistPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerlistPageRoutingModule {}
