import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StatpickerPage } from './statpicker.page';

const routes: Routes = [
  {
    path: '',
    component: StatpickerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StatpickerPageRoutingModule {}
