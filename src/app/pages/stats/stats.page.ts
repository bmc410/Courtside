import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/matchservice';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { Platform, PopoverController, ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatchWithId, GameWithId } from 'src/app/models/appModels';
import { analytics } from 'firebase';

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
    public toastController: ToastController,
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
      //window.location.href = '/login';
      this.router.navigate(['/login']);
  }

  async getMatchesAsync(event) {
    this.matches = []
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
    if (this.match && this.game.gamedisplay == "Match Summary") {
      var summaryitem = {
        mId: this.match.objectId
      }
      this.router.navigate(['/app/tabs/stats/matchsummary'], { queryParams: { context: JSON.stringify(summaryitem) } });
    }
    else {
      var item = {
        gId: this.game.objectId,
        htId: this.matches.filter(x => x.objectId === this.match.objectId)[0].HomeTeamId,
        mId: this.match.objectId
      }
  
      this.router.navigate(['/app/tabs/stats/statpicker'], { queryParams: { context: JSON.stringify(item) } });
  
    }
  }

  ionViewDidEnter() {
    this.getMatchesAsync(null)
    this.match = new MatchWithId()
    this.game = new GameWithId()
  }

  async onMatchChange(m:any) {
    this.gamesformatch = []
    await this.matchService.getAllGameForMatch(m.value.objectId).then(async x => {
      var json = JSON.stringify(x);
      var tpData = JSON.parse(json);
      this.gamesformatch = tpData
      if (this.gamesformatch.length > 0) {
        this.gamesformatch.forEach(game => {
          game.gamedisplay = "Game " + game.GameNumber + " (" + game.HomeScore + " - " + game.OpponentScore + ")"
        });
        var game: any = {}
        game.gamedisplay = "Match Summary"
        this.gamesformatch.splice(0, 0, game)
      }
      else {
        const toast = await this.toastController.create({
          color: 'primary',
          duration: 5000,
          message: 'The match has not started yet'
        });
        await toast.present();
      }
    })
  }
}
