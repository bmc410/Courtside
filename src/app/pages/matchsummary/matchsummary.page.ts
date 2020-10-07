import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { element } from 'protractor';
import { gamescore, GameWithId, highstat, leader, matchscore, MatchWithId, PlayerWithId, statEntry, statView, teamstat, teamstats, TeamWithId } from 'src/app/models/appModels';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatchService } from 'src/app/services/matchservice';

@Component({
  selector: 'app-matchsummary',
  templateUrl: './matchsummary.page.html',
  styleUrls: ['./matchsummary.page.scss'],
})
export class MatchsummaryPage implements OnInit {
  context: any;
  players: PlayerWithId[] = [];
  allPlayers: PlayerWithId[] = [];
  match: MatchWithId;
  games: GameWithId[] = []
  scores: gamescore[] = []
  displayedColumns = ['hometeam'];
  stats: statEntry[] = [];
  statviews: statView[] = [];
  teamtotal: statView;
  teamtotals: statView[] = []
  matchgameStats: statEntry[] = [];
  leaders: leader[] = []
  highstats: highstat[] = []
  ts: teamstat[] = []
  teamactions: string[] = ["Kills", "Errors", "Total Attacks", "Assists", "Aces", "Blocks"]
  menuitems = [{
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
  }];

  constructor(private matchService: MatchService,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {
    this.matchService.loadMatches()
    this.route.queryParams.subscribe(params => {
      this.context = JSON.parse(params['context']);
    })
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

    this.stats.forEach(element => {
      const index = this.statviews.findIndex(
        sv => sv.PlayerId === element.PlayerId
      );
      switch (element.StatType.toLowerCase()) {
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
    });

    var hs: highstat[] = []
    var s: highstat = {}
    s.playerid = ""
    s.statcount = 0
    s.stattype = ""
    var highstat = 1000

    this.statviews.forEach(element => {
      var highstat = 0
      var s: highstat = {}
      Object.keys(element).forEach(key => {
        if (Number.isInteger(element[key]) && element[key] >= highstat) {
          highstat = element[key]
          s = {
            stattype: key,
            playerid: element.PlayerId,
            statcount: element[key]
          }
        }
      }
      );
      hs.push(s)
      //       this.statviews = this.statviews.filter( x => x.PlayerId != element.PlayerId)
      // const xMax = Math.max.apply(null, this.statviews.map(function (o) { return o.k; }));
    });
    this.highstats = hs.sort((a, b) => a.statcount > b.statcount ? -1 : a.statcount > b.statcount ? 1 : 0).slice()

    var i = 1
    this.highstats.forEach(element => {
      if (i < 4) {
        var l: leader = {}
        var p = this.getPlayer(element.playerid)
        l.fname = p.FirstName
        l.lname = p.LastName
        l.action = element.statcount + this.getActionFromStat(element.stattype)
        this.leaders.push(l)
        i += 1
      }
    });


    this.teamactions.forEach(action => {
      var t: teamstat = {}
      t.action = action

      switch (action) {
        case "Kills":
          t.value = this.teamtotal.k.toString()
          break;
        case "Errors":
          t.value = (this.teamtotal.be + this.teamtotal.bhe + this.teamtotal.he
          + this.teamtotal.se + this.teamtotal.sre).toString()
          break;
        case "Total Attacks":
          t.value = (this.teamtotal.k + this.teamtotal.he + this.teamtotal.h).toString()
          break;
        case "Assists":
          t.value = this.teamtotal.a.toString()
          break;
        case "Aces":
          t.value = this.teamtotal.sa.toString()
          break;
        case "Blocks":
          t.value = this.teamtotal.b.toString()
          break;
        default:
          break;
      }
      this.ts.push(t)
    });

    //console.log(this.teamtotal)

    // const xMax = Math.max.apply(null, this.statviews.map(function (o) { return o.k; }));
    // var maxXObject = this.statviews.filter(function (o) { return o.k === xMax; })[0];


  }

  getActionFromStat(stat: string): string {
    var action = ""
    switch (stat.toLowerCase()) {
      case "k":
        action = " Kills"
        break;
      case "he":
        action = " Attack errors"
        break;
      case "be":
        action = " Block errors"
        break;
      case "bhe":
        action = " Ball handling errors"
        break;
      case "sre":
        action = " Serve receive errors"
        break;
      case "sr":
        action = " Serve receives "
        break;
      case "se":
        action = " Service errors"
        break;
      case "te":
        action = " Team errors"
        break;
      case "tp":
        action = " Team points"
        break;
      case "sa":
        action = " Service aces"
        break;
      case "bt":
        action = " Block touchs"
        break;
      case "h":
        action = " Attachs"
        break;
      case "d":
        action = " Digs"
        break;
      case "b":
        action = " Blocks"
        break;
      case "a":
        action = " Assists"
        break;
      default:
        action = action
        break;
    }
    return action
  }

  getPlayer(playerId): PlayerWithId {
    return this.players.filter(x => x.objectId === playerId)[0]
  }

  getStatName(stat): String {
    var description: string = ""


    return description
  }

  logoff() {
    this.authenticationService.logout();
    //window.location.href = '/login';
    this.router.navigate(['/login']);
}

  async ngOnInit() {
    await this.matchService.getPlayers().then(async result => {
      var json = JSON.stringify(result);
      this.allPlayers = JSON.parse(json)

      await this.matchService.getMatchById(this.context.mId).then(async result => {
        var json = JSON.stringify(result);
        this.match = JSON.parse(json)[0];
        //this.match = this.match[0]
        await this.matchService.getPlayersByTeamId(this.match.HomeTeamId).then(async result => {
          var json = JSON.stringify(result);
          var players = JSON.parse(json)
          players.forEach(p => {
            this.players.push(this.allPlayers.filter(x => x.objectId == p.PlayerId)[0])
          });
          await this.matchService.getAllGameForMatch(this.context.mId).then(async result => {
            var json = JSON.stringify(result);
            this.games = JSON.parse(json);
            var count = this.games.length
            var i = 1
            this.games.forEach(async element => {
              await this.matchService.getstats(element.objectId).then(result => {
                var json = JSON.stringify(result);
                var stats = JSON.parse(json);
                stats.forEach(element => {
                  this.stats.push(element);
                });
                if (i == count) {
                  this.setupStatView();
                  this.showData();
                }
                else {
                  i += 1;
                }
              })
            });
          })
        })
      })
    })
  }
}
