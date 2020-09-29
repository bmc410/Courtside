import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthguardService } from './services/authguard.service';

const routes: Routes = [
  {
    path: '',
    //loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule),
    redirectTo: '/app/tabs/stats',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'app',
    // canActivate: [AuthguardService],
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  }
  // {
  //   path: 'teams',
  //   loadChildren: () => import('./pages/teams/teams.module').then( m => m.TeamsPageModule)
  // },
  // {
  //   path: 'teamdetail',
  //   loadChildren: () => import('./pages/teamdetail/teamdetail.module').then( m => m.TeamdetailPageModule)
  // },
  // {
  //   path: 'matches',
  //   loadChildren: () => import('./pages/matches/matches.module').then( m => m.MatchesPageModule)
  // },
  // {
  //   path: 'match',
  //   loadChildren: () => import('./pages/match/match.module').then( m => m.MatchPageModule)
  // },
  // {
  //   path: 'playerpopover',
  //   loadChildren: () => import('./pages/playerpopover/playerpopover.module').then( m => m.PlayerpopoverPageModule)
  // },
  // {
  //   path: 'teamplayerpopover',
  //   loadChildren: () => import('./pages/teamplayerpopover/teamplayerpopover.module').then( m => m.TeamplayerpopoverPageModule)
  // },
  // {
  //   path: 'playerlist',
  //   loadChildren: () => import('./pages/playerlist/playerlist.module').then( m => m.PlayerlistPageModule)
  // },
  // {
  //   path: 'playerdetail',
  //   loadChildren: () => import('./pages/playerdetail/playerdetail.module').then( m => m.PlayerdetailPageModule)
  // },
  // {
  //   path: 'matchdetail',
  //   loadChildren: () => import('./pages/matchdetail/matchdetail.module').then( m => m.MatchdetailPageModule)
  // },
  // {
  //   path: 'gameselect',
  //   loadChildren: () => import('./pages/gameselect/gameselect.module').then( m => m.GameselectPageModule)
  // },
  // {
  //   path: 'playerpicker',
  //   loadChildren: () => import('./pages/playerpicker/playerpicker.module').then( m => m.PlayerpickerPageModule)
  // },
  // {
  //   path: 'scoreboard',
  //   loadChildren: () => import('./pages/scoreboard/scoreboard.module').then( m => m.ScoreboardPageModule)
  // },
  // {
  //   path: 'stats',
  //   loadChildren: () => import('./pages/stats/stats.module').then( m => m.StatsPageModule)
  // },
  // {
  //   path: 'statpicker',
  //   loadChildren: () => import('./pages/statpicker/statpicker.module').then( m => m.StatpickerPageModule)
  // },
  // {
  //   path: 'playbyplay',
  //   loadChildren: () => import('./pages/playbyplay/playbyplay.module').then( m => m.PlaybyplayPageModule)
  // },
  // {
  //   path: 'individualstats',
  //   loadChildren: () => import('./pages/individualstats/individualstats.module').then( m => m.IndividualstatsPageModule)
  // },
  // {
  //   path: 'scoremodal',
  //   loadChildren: () => import('./pages/scoremodal/scoremodal.module').then( m => m.ScoremodalPageModule)
  // },
  // {
  //   path: 'gamestats',
  //   loadChildren: () => import('./pages/gamestats/gamestats.module').then( m => m.GamestatsPageModule)
  // },
  // {
  //   path: 'matchsummary',
  //   loadChildren: () => import('./pages/matchsummary/matchsummary.module').then( m => m.MatchsummaryPageModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
