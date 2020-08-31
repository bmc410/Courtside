import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerpopoverPage } from './playerpopover.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerpopoverPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerpopoverPageRoutingModule {}
