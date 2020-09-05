import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CheckTutorial } from './providers/check-tutorial.service';
import { AuthguardService } from './services/authguard.service';


const routes1: Routes = [
  { 
    path: '', 
    canActivate: [AuthguardService], 
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
];

const routes: Routes = [
  {
    path: '',
    redirectTo: '/app/tabs/teams',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule)
  },
  {
    path: 'support',
    loadChildren: () => import('./pages/support/support.module').then(m => m.SupportModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'signup',
    loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignUpModule)
  },
  {
    path: 'app',
    canActivate: [AuthguardService],
    loadChildren: () => import('./pages/tabs-page/tabs-page.module').then(m => m.TabsModule)
  },
  {
    path: 'tutorial',
    loadChildren: () => import('./pages/tutorial/tutorial.module').then(m => m.TutorialModule),
    canLoad: [CheckTutorial]
  },
  {
    path: 'teams',
    loadChildren: () => import('./pages/teams/teams.module').then( m => m.TeamsPageModule)
  },
  {
    path: 'teamdetail',
    loadChildren: () => import('./pages/teamdetail/teamdetail.module').then( m => m.TeamdetailPageModule)
  },
  {
    path: 'matches',
    loadChildren: () => import('./pages/matches/matches.module').then( m => m.MatchesPageModule)
  },
  {
    path: 'match',
    loadChildren: () => import('./pages/match/match.module').then( m => m.MatchPageModule)
  },
  {
    path: 'playerpopover',
    loadChildren: () => import('./pages/playerpopover/playerpopover.module').then( m => m.PlayerpopoverPageModule)
  },
  {
    path: 'teamplayerpopover',
    loadChildren: () => import('./pages/teamplayerpopover/teamplayerpopover.module').then( m => m.TeamplayerpopoverPageModule)
  },
  {
    path: 'playerlist',
    loadChildren: () => import('./pages/playerlist/playerlist.module').then( m => m.PlayerlistPageModule)
  },
  {
    path: 'playerdetail',
    loadChildren: () => import('./pages/playerdetail/playerdetail.module').then( m => m.PlayerdetailPageModule)
  },
  {
    path: 'matchdetail',
    loadChildren: () => import('./pages/matchdetail/matchdetail.module').then( m => m.MatchdetailPageModule)
  },
  {
    path: 'gameselect',
    loadChildren: () => import('./pages/gameselect/gameselect.module').then( m => m.GameselectPageModule)
  },
  {
    path: 'playerpicker',
    loadChildren: () => import('./pages/playerpicker/playerpicker.module').then( m => m.PlayerpickerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
