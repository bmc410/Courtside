import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IndividualstatsPage } from './individualstats.page';

const routes: Routes = [
  {
    path: '',
    component: IndividualstatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IndividualstatsPageRoutingModule {}
