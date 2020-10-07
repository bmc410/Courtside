import { Component, OnInit } from '@angular/core';
import { MatchService } from 'src/app/services/matchservice';
import { ActivatedRoute, Router } from '@angular/router';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { Platform, PopoverController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PlayerWithId, statEntry, gameMatch, statView } from 'src/app/models/appModels';

@Component({
  selector: 'app-individualstats',
  templateUrl: './individualstats.page.html',
  styleUrls: ['./individualstats.page.scss'],
})
export class IndividualstatsPage implements OnInit {
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
  displayedColumns = ['firstName', 'k', 'he', 'h',
  'b', 'bt',
  'be', 'a',
  'd', 'bhe',
  'sre', 'se',
  'sa'];

  constructor(private matchService: MatchService,
    private route: ActivatedRoute,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    public platform: Platform,
    private router: Router,
    private authenticationService: AuthenticationService,
    private popover: PopoverController) { 
      this.matchService.loadMatches()
      this.route.queryParams.subscribe(params => {
        this.context = JSON.parse(params['context']);
      })
    }

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    async ngOnInit() {
      this.stats = []
      var gamecount = 1
      var loaded = false
      await this.matchService.getPlayers().then(async result => {
        var json = JSON.stringify(result);
        this.allPlayers = JSON.parse(json)
        await this.matchService.getMatchById(this.context.mId).then(async result => {
          var json = JSON.stringify(result);
          var g = JSON.parse(json);
          await this.matchService.getPlayersByTeamId(this.context.htId).then(async result => {
            var json = JSON.stringify(result);
            var g = JSON.parse(json);
            g.forEach(p => {
              this.players.push(this.allPlayers.filter(x => x.objectId == p.PlayerId)[0])
            });
            this.context.gfm.forEach(async element => {
              await this.matchService.getstats(element.objectId).then(result => {
                var json = JSON.stringify(result);
                var st = JSON.parse(json);
                st.forEach(element => {
                  this.stats.push(element)
                });
                this.setupStatView();
                this.showData();
                gamecount += 1
              });
            })
          })
        })
      })
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
      sr: 0,
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
      sv.sr = 0;
      sv.sa = 0;
      this.statviews.push(sv);
    });
  }

  showData() {
    if (this.statviews != undefined && this.statviews.length > 0) 
    {
      this.stats.forEach(element => {
        const index = this.statviews.findIndex(
          sv => sv.PlayerId === element.PlayerId
        );
        switch (element.StatType.toLowerCase()) {
          case "k":
            this.statviews[index].k += 1;
            this.teamtotal.k += 1;
            this.statviews[index].h += 1;
            this.teamtotal.h += 1;
            break;
          case "h":
            this.statviews[index].h += 1;
            this.teamtotal.h += 1;
            break;
          case "he":
            this.statviews[index].he += 1;
            this.teamtotal.he += 1;
            this.statviews[index].h += 1;
            this.teamtotal.h += 1;
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
            case "sr":
              this.statviews[index].sr += 1;
              this.teamtotal.sr += 1;
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
        // this.pct =
        //   (this.statviews[index].k - this.statviews[index].he) /
        //   (this.statviews[index].k + this.statviews[index].h);
      });
  
      const xMax = Math.max.apply(null, this.statviews.map(function(o) { return o.k; }));
      var maxXObject = this.statviews.filter(function(o) { return o.k === xMax; })[0];
  
      const maxValueOfY = Math.max(...this.statviews.map(o => o.k), 0);
  
    } 
  }
}
