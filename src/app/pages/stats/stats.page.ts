import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/matchservice';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { Platform, PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatchWithId, GameWithId } from 'src/app/models/appModels';

@Component({
  selector: 'app-stats',
  templateUrl: './stats.page.html',
  styleUrls: ['./stats.page.scss'],
})
export class StatsPage implements OnInit {
  matches: MatchWithId[] = [];
  match: MatchWithId;
  gamesformatch: any[] = []
  game:any
  
  constructor(private matchService: MatchService,
    private route: ActivatedRoute,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    public platform: Platform,
    private router: Router,
    private authenticationService: AuthenticationService,
    private popover: PopoverController) { 
      this.matchService.loadMatches()
    }

  ngOnInit() {
    this.getMatchesAsync(null)
    this.match = new MatchWithId()
    this.game = new GameWithId()
  }

  menuitems = [{
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
  }];

  logoff() {
      this.authenticationService.logout();
      window.location.href = '/login';
      //this.router.navigate(['/login']);
  }

  async getMatchesAsync(event) {
    await this.matchService.getMatchesAsync().subscribe(result => {
      var json = JSON.stringify(result);
      this.matches = JSON.parse(json);
      this.matches.forEach(element => {
        element.matchdisplay = element.Home + " vs " + element.Opponent + " (" + element.MatchDate + ")";
      });
      if(event) {
        setTimeout(() => {
          //console.log('Async operation has ended');
          event.target.complete();
        }, 0);
      }
    });
  }

  compareFn(e1: MatchWithId, e2: MatchWithId): boolean {
    return e1 && e2 ? e1.objectId === e2.objectId : e1 === e2;
  }

  showstatpicker() {
    var item = {
      gId: this.game.objectId,
      htId: this.matches.filter(x => x.objectId === this.match.objectId)[0].HomeTeamId,
      mId: this.match.objectId
    }

    this.router.navigate(['/app/tabs/stats/statpicker'], { queryParams: { context: JSON.stringify(item) } });
  }

  async onMatchChange(m:any) {
    console.log(m)
    await this.matchService.getAllGameForMatch(m.value.objectId).then(x => {
      var json = JSON.stringify(x);
      var tpData = JSON.parse(json);
      this.gamesformatch = tpData
      this.gamesformatch.forEach(game => {
        game.gamedisplay = "Game " + game.GameNumber + " (" + game.HomeScore + " - " + game.OpponentScore + ")"
      });
      
      //this.match = m
      console.log(tpData)
    })
    
  }

}
