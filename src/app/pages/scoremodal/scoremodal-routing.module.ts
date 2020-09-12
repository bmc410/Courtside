import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ScoremodalPage } from './scoremodal.page';

const routes: Routes = [
  {
    path: '',
    component: ScoremodalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScoremodalPageRoutingModule {}
