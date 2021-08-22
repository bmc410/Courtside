import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabletmatchviewPage } from './tabletmatchview.page';

const routes: Routes = [
  {
    path: '',
    component: TabletmatchviewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabletmatchviewPageRoutingModule {}
