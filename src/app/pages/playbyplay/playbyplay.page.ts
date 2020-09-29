import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/matchservice';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { Platform, PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PlayerWithId, statEntry, gameMatch, statView } from 'src/app/models/appModels';
import { Observable, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-playbyplay',
  templateUrl: './playbyplay.page.html',
  styleUrls: ['./playbyplay.page.scss'],
})
export class PlaybyplayPage implements OnInit {
  context: any;
  players: PlayerWithId[] = [];
  allPlayers: PlayerWithId[] = [];
  allstats: statEntry[] = [];
  playbyplay: any[] = [];
  match: gameMatch;
  stats: statEntry[] = [];
  statviews: statView[] = [];
  teamtotal: statView;
  teamtotals: statView[] = []
  matchgameStats: statEntry[] = [];
  pct: number = 0;
  displayedColumns = ['homescore', 'opponentscore', 'action'];
  mytimer: Subscription;
  interval = null;    
  menuitems = [{
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
  }];

  constructor(private matchService: MatchService,
    private route: ActivatedRoute,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    public platform: Platform,
    private router: Router,
    private authenticationService: AuthenticationService,
    private popover: PopoverController) { 
      this.matchService.loadMatches()
      // this.mytimer = timer(0, 5000)
      //   .subscribe(() => this.getData())
      this.route.queryParams.subscribe(params => {
        this.context = JSON.parse(params['context']);
      })
    }
  
  toggleliveview(e) {
    if (e.detail.checked) {
      this.interval = setInterval(() => { 
        this.getData()
    }, 5000);
    }
    else {
      clearInterval(this.interval)
    }
  }
  
  getData() {
      this.matchService.getPlayers().then(result => {
        var json = JSON.stringify(result);
        this.allPlayers = JSON.parse(json)
        this.matchService.getMatchById(this.context.mId).then(result => {
          var json = JSON.stringify(result);
          var g = JSON.parse(json);
          this.matchService.getPlayersByTeamId(this.context.htId).then(result => {
            var json = JSON.stringify(result);
            var g = JSON.parse(json);
            g.forEach(p => {
              this.players.push(this.allPlayers.filter(x => x.objectId == p.PlayerId)[0])
            });
            this.matchService.getPlayByPlay(this.context.gId).then(result => {
              var json = JSON.stringify(result);
              this.playbyplay= JSON.parse(json);
              //this.playbyplay = this.playbyplay.sort(x )
              this.playbyplay.sort((a,b)=>b.createdAt.localeCompare(a.createdAt));
            })
  
              
              this.setupStatView();
              this.showData();
          })
        })
      })
  }
  
  ngOnDestroy() {
    //this.mytimer.unsubscribe()
  }

  ngOnInit() {
    this.getData()
  }

  

  logoff() {
      this.authenticationService.logout();
      //window.location.href = '/login';
      this.router.navigate(['/login']);
  }

  setupStatView() {
    this.teamtotal = {
      jersey: "",
      firstName: "",
      lastName: "",
      PlayerId: "",
      k: 0,
      h: 0,
      he: 0,
      b: 0,
      bt: 0,
      be: 0,
      a: 0,
      d: 0,
      bhe: 0,
      sre: 0,
      se: 0,
      sa: 0
    }
    this.statviews = [];
    this.teamtotals = [];
    this.matchgameStats = [];
    this.players.forEach(element => {
      let sv = <statView>{};
      sv.firstName = element.FirstName;
      sv.lastName = element.LastName;
      //sv.jersey = element.jersey;
      sv.PlayerId = element.objectId;
      sv.k = 0;
      sv.h = 0;
      sv.a = 0;
      sv.b = 0;
      sv.be = 0;
      sv.bhe = 0;
      sv.bt = 0;
      sv.d = 0;
      sv.he = 0;
      sv.se = 0;
      sv.sre = 0;
      sv.sa = 0;
      this.statviews.push(sv);
    });
  }

  showData() {
      
    this.stats.forEach(element => {
      const index = this.statviews.findIndex(
        sv => sv.PlayerId === element.PlayerId
      );
      switch (element.StatType) {
        case "k":
          this.statviews[index].k += 1;
          this.teamtotal.k += 1;
          break;
        case "h":
          this.statviews[index].h += 1;
          this.teamtotal.h += 1;
          break;
        case "he":
          this.statviews[index].he += 1;
          this.teamtotal.he += 1;
          break;
        case "b":
          this.statviews[index].b += 1;
          this.teamtotal.b += 1;
          break;
        case "bt":
          this.statviews[index].bt += 1;
          this.teamtotal.bt += 1;
          break;
        case "be":
          this.statviews[index].be += 1;
          this.teamtotal.be += 1;
          break;
        case "a":
          this.statviews[index].a += 1;
          this.teamtotal.a += 1;
          break;
        case "d":
          this.statviews[index].d += 1;
          this.teamtotal.d += 1;
          break;
        case "bhe":
          this.statviews[index].bhe += 1;
          this.teamtotal.bhe += 1;
          break;
        case "sre":
          this.statviews[index].sre += 1;
          this.teamtotal.sre += 1;
          break;
        case "se":
          this.statviews[index].se += 1;
          this.teamtotal.se += 1;
          break;
        case "sa":
            this.statviews[index].sa += 1;
            this.teamtotal.sa += 1;
            break;
        default:
          break;
      }
      this.pct =
        (this.statviews[index].k - this.statviews[index].he) /
        (this.statviews[index].k + this.statviews[index].h);
    });
  }

}
