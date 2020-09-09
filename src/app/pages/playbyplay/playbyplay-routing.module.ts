import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlaybyplayPage } from './playbyplay.page';

const routes: Routes = [
  {
    path: '',
    component: PlaybyplayPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlaybyplayPageRoutingModule {}
