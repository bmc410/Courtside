import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';


const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'matches',
        children: [
          {
            path: '',
            loadChildren: () => import('../matches/matches.module').then(m => m.MatchesPageModule)
          },
          {
            path: 'matchdetail',
            children: [
              {
                path: '',
                loadChildren: () => import('../matchdetail/matchdetail.module').then(m => m.MatchdetailPageModule)                
              },
              {
                path: 'match',
                loadChildren: () => import('../match/match.module').then(m => m.MatchPageModule)                
              },
              {
                path: 'match/:id',
                loadChildren: () => import('../match/match.module').then(m => m.MatchPageModule)                
              }
            ]
          }
        ]
      },
      {
        path: 'playerlist',
        children: [
          {
            path: '',
            loadChildren: () => import('../playerlist/playerlist.module').then(m => m.PlayerlistPageModule)
          },
          {
            path: 'playerdetail',
            loadChildren: () => import('../playerdetail/playerdetail.module').then(m => m.PlayerdetailPageModule)
          }
        ]
      },
    
      {
        path: 'teams',
        children: [
          {
            path: '',
            loadChildren: () => import('../teams/teams.module').then(m => m.TeamsPageModule)
          },
          {
            path: 'teamdetail',
            loadChildren: () => import('../teamdetail/teamdetail.module').then(m => m.TeamdetailPageModule)
          }
        ]
      },
      {
        path: 'stats',
        children: [
          {
            path: '',
            loadChildren: () => import('../stats/stats.module').then(m => m.StatsPageModule)
          },
          {
          path: 'statpicker',
          children: [
            { path: "",
              loadChildren: () => import('../statpicker/statpicker.module').then(m => m.StatpickerPageModule)
            },
            { path: "playbyplay",
              loadChildren: () => import('../playbyplay/playbyplay.module').then(m => m.PlaybyplayPageModule)
            },
            { path: "individualstats",
              loadChildren: () => import('../individualstats/individualstats.module').then(m => m.IndividualstatsPageModule)
            }
          ]
          }
        ]
      },
      {
        path: '',
        redirectTo: '/app/tabs/teams',
        pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule { }

