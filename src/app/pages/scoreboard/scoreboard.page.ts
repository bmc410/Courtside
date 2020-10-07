import { Component, OnInit, NgZone } from '@angular/core';
import { PopoverController, ToastController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
// import { ConnectionService } from 'ng-connection-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { PlayerWithId, statEntry, gameMatch, statView, stat } from 'src/app/models/appModels';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import {ButtonModule} from 'primeng/button';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.page.html',
  styleUrls: ['./scoreboard.page.scss'],
})
export class ScoreboardPage implements OnInit {
  context: any;
  players: PlayerWithId[] = [];
  allPlayers: PlayerWithId[] = [];
  allstats: statEntry[] = [];
  playbyplay: any[] = [];
  match: gameMatch;
  //stats: statEntry[] = [];
  stats: stat[] = [];
  teamtotal: statView;
  teamtotals: statView[] = []
  matchgameStats: statEntry[] = [];
  currentstats: stat[] = []
  pct: number = 0;
  deletevisible = false;
  opponent: any
  homescore = 0
  hometeam = ""
  opponentscore = 0
  opponentteam = ""
  matchcontext: any;
  subs = 0
  displayedColumns = ['fullname', 'stattype'];


  constructor(private popover: PopoverController,
    private router: Router,
    public navParams: NavParams,
    private matchService: MatchService,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController) { }

  async ngOnInit() {
    this.matchcontext = this.navParams.data.context;
    this.homescore = this.matchcontext.game.HomeScore
    this.opponentscore = this.matchcontext.game.OpponentScore
    this.subs = this.matchcontext.game.subs
    this.hometeam = this.matchcontext.match.Home
    this.opponentteam = this.matchcontext.match.Opponent

   
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
            await this.getstats()  
          })
      })
    })
  }

  async getstats() {
    this.stats = []
    await this.matchService.getstats(this.matchcontext.game.objectId).then(result => {
      var json = JSON.stringify(result);
      var st = JSON.parse(json);
      st.forEach(element => {
        var stat: stat = {}
        var p = this.allPlayers.filter(x => x.objectId === element.PlayerId)[0]
        stat.firstname = p.FirstName
        stat.lastname = p.LastName
        stat.fullname = p.LastName + " " + p.FirstName
        stat.stattype = element.StatType
        stat.objectId = element.objectId
        this.stats.push(stat)
      });
      //this.setupStatView();
      //this.showData();
      //gamecount += 1
    });
  }


  deletestat(statId) {
    this.matchService.deleteStat(statId).then(x => {
      this.getstats()
      this.matchService.deletePBPByStatId(statId)
    })
  }

  update(e) {
    switch (e.target.id) {
      case 'hs':
        this.matchcontext.game.HomeScore -= 1;
        break;
      case 'ha':
        this.matchcontext.game.HomeScore += 1;
        break;
      case 'os':
        this.matchcontext.game.OpponentScore -= 1;
        break;
      case 'oa':
        this.matchcontext.game.OpponentScore += 1;
        break;
        case 'ss':
        this.matchcontext.game.subs -= 1;
        break;
      case 'sa':
        this.matchcontext.game.subs += 1;
        break;

      default:
        break;
    }
  }


  logoff() {
    this.authenticationService.logout();
    //window.location.href = '/login';
    this.router.navigate(['/login']);
  }

  dismiss(item) {
    this.popover.dismiss(item);
  }

  close() {
    this.popover.dismiss(this.matchcontext)
  }

}
