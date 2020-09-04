import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PlayerdetailPage } from './playerdetail.page';

const routes: Routes = [
  {
    path: '',
    component: PlayerdetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PlayerdetailPageRoutingModule {}
