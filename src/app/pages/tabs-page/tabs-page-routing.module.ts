import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs-page';


//http://localhost:4200/app/tabs/matches/matchdetail/match?context=%7B%22gameNumber%22:%221%22,%22Home%22:%22RL%20Varsity%22,%22MatchDate%22:%2210%2F12%2F2020%22,%22objectId%22:%22ihgsKTcYIF%22,%22Opponent%22:%22Central%22,%22HomeTeamId%22:%22dIV4QF9u9a%22%7D

const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'admin',
        children: [
          {
            path: '',
            loadChildren: () => import('../admin/admin.module').then(m => m.AdminPageModule)
          }
        ]
      },
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
              // {
              //   path: 'match',
              //   loadChildren: () => import('../match/match.module').then(m => m.MatchPageModule)                
              // },
              // {
              //   path: 'match/:id',
              //   loadChildren: () => import('../match/match.module').then(m => m.MatchPageModule)                
              // },
              {
                path: 'match',
                loadChildren: () => import('../tabletmatchview/tabletmatchview.module').then(m => m.TabletmatchviewPageModule)                
              },
              {
                path: 'match/:id',
                loadChildren: () => import('../tabletmatchview/tabletmatchview.module').then(m => m.TabletmatchviewPageModule)                
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
            path: 'matchsummary',
            loadChildren: () => import('../matchsummary/matchsummary.module').then(m => m.MatchsummaryPageModule)
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
            },
            { path: "matchsummary",
              loadChildren: () => import('../matchsummary/matchsummary.module').then(m => m.MatchsummaryPageModule)
            }
          ]
          }
        ]
      },
      {
        path: '',
        redirectTo: 'stats',
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

