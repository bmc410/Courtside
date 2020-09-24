import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatchsummaryPage } from './matchsummary.page';

const routes: Routes = [
  {
    path: '',
    component: MatchsummaryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatchsummaryPageRoutingModule {}
