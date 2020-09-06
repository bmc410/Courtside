import { Component, OnInit, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ConferenceData } from 'src/app/providers/conference-data';
import { Platform } from '@ionic/angular';
import { FormControl } from '@angular/forms';
import { PopoverController } from '@ionic/angular';
import { PlayerpopoverPage } from '../playerpopover/playerpopover.page';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { CourtPosition, GameScore, GameWithId, PlayerWithId, Stat, statEntry } from 'src/app/models/appModels';
import { async } from 'rxjs/internal/scheduler/async';
import { PlayerpickerPage } from '../playerpicker/playerpicker.page';
import { ScoreboardPage } from '../scoreboard/scoreboard.page';


@Component({
  selector: 'app-match',
  templateUrl: './match.page.html',
  styleUrls: ['./match.page.scss'],
})
export class MatchPage implements OnInit {

  public semSelected: any;
  player: MatchUser;
  player1: MatchUser;
  playerPos1 = "Select Player";
  playerPos2 = "Select Player";
  playerPos3 = "Select Player";
  playerPos4 = "Select Player";
  playerPos5 = "Select Player";
  playerPos6 = "Select Player";
  gameNumber = 1;
  gameScore: GameScore;
  games: GameWithId[] = [];
  game: GameWithId;
  players: PlayerWithId[] = [];
  allPlayers: PlayerWithId[] = [];
  matchStats: Stat[] = [];
  stats: statEntry[] = [];
  stat: Stat;
  liberoDisabled = false;
  mobile = false;
  startHidden = false;
  displayscoreboard = false;
  value18: number = 10;

  compareFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = this.compareFn;



  users: MatchUser[] = [];
  allUsers: MatchUser[] = [];
  playerPositions: CourtPosition[] = [];
  match: any;
  context: any;
  title:any;

  constructor(
    private matchService: MatchService,
    private route: ActivatedRoute,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    public platform: Platform,
    private router: Router,
    private authenticationService: AuthenticationService,
    private popover: PopoverController) { }

  ngOnInit() {
    for (let index = 0; index < 7; index++) {
      const c = new CourtPosition();
      c.playerPos = "Select Player";
      c.posNo = index;
      this.playerPositions.push(c);
    }

    this.route.queryParams.subscribe(params => {
      this.match = JSON.parse(params['context']);
      this.title = this.match.Home + ' vs ' + this.match.Opponent
    });

    this.game = new GameWithId()
    this.gameScore = new GameScore();
    this.gameNumber = Number(this.match.gameNumber);
    this.game.subs = 0;

    this.getPlayerData()

    // if (this.route.snapshot.params.objectId != undefined)
    //   this.match = this.route.snapshot.params;
    // else {
    //   this.router.navigate(['/app/tabs/matches']);
    //   return
    // }
  }

  async showscoreboard(ev) {
    // this.displayscoreboard = true;
    const modal = await this.popover.create({
      component: ScoreboardPage,
      event: ev,
      translucent: true,
      componentProps: { context: this.players }
    });
    modal.style.cssText = '--width: 99vw';

    return await modal.present();
  }

  async getPlayerData() {
    var _this = this;
    await this.matchService.getPlayers().then(async allPlayers => {
      var json = JSON.stringify(allPlayers);
      var tpData = JSON.parse(json);
      await this.matchService.getPlayersByTeamId(this.match.HomeTeamId).then(async teamPlayers => {
        var json1 = JSON.stringify(teamPlayers);
        var tpData1 = JSON.parse(json1);
        tpData1.forEach(p => {
          var player = tpData.filter(x => x.objectId == p.PlayerId)[0]
          player.jersey = tpData1.filter(x => x.PlayerId == player.objectId)[0].Jersey
          this.players.push(player);
        });

        this.allPlayers = this.players.slice();
  
        await this.matchService.getGameForMatchByNumber(this.match.objectId, this.match.gameNumber).then(async result => {
          var json = JSON.stringify(result);
          var game = JSON.parse(json);
          if (game.length == 0) {
                let g = new GameWithId()
                g.gamenumber = this.gameNumber
                g.matchid = this.match.objectId
                g.OpponentScore = 0
                g.HomeScore = 0
                g.subs = 0
                this.matchService.createGame(g).subscribe(result => {
                  this.matchService.getGameForMatchByNumber(this.match.objectId, this.gameNumber).then(result => {
                    var j = JSON.stringify(result);
                    var game = JSON.parse(j);
                    this.game.objectId = game[0].objectId;
                    this.game.HomeScore = 0;
                    this.game.OpponentScore = 0;
                    this.game.subs = 0;
                    this.game.gamenumber = this.gameNumber;
                  })
                })
          }
          
          else {
            this.game = game[0];
            await this.matchService.getstats(this.game.objectId).then(data => {
              var j = JSON.stringify(data);
              var stats = JSON.parse(j);
              stats.forEach(function (s) {
                var rotation = JSON.parse(s.Rotation);
                let stat = {
                  statid: s.GameId,
                  homescore: s.HomeScore,
                  matchid: s.OpponentScore,
                  gamenumber: _this.match.gameNumber,
                  stattype: s.StatType,
                  playerid: s.PlayerId,
                  statdate: s.createdAt,
                  //pos: Map<any,any>,
                  id: s.objectId,
                  opponentscore: s.OpponentScore,
                  rotation: rotation,
                  subs: s.Subs
                }
                _this.stats.push(stat); 
              });
      
              if (this.stats && this.stats.length > 0) {
                this.startMatch();
                var r = this.stats[this.stats.length-1]
                this.game.HomeScore = r.homescore;
                this.game.OpponentScore = r.opponentscore;
                this.game.subs = r.subs;
                var pos = r.rotation
                for (let i = 0; i < 6; i++) {
                  var p1 = this.allPlayers.filter(p => p.objectId == pos[i].objectId)[0]
                  this.playerPositions[i + 1].posNo = pos[i].posNo;
                  this.playerPositions[i + 1].player = p1;
                  this.playerPositions[i + 1].playerPos =
                    p1.FirstName + " - " + p1.jersey;
                  this.players = this.players.filter(x => x.objectId != p1.objectId)
                }
              }
            });
            this.game.gamenumber = this.match.gameNumber;
            this.game.objectId = game[0].objectId;
            this.game.subs = game[0].Subs;
            }
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

  startMatch() {
    this.liberoDisabled = true;
    this.startHidden = true;
    const cp  = Object.assign([], this.playerPositions);
    if (this.stats.length == 0) {
        this.matchService.addPlayByPlay(this.game,cp,"start",null)
    }
  }
  
  logoff() {
      this.authenticationService.logout();
      this.router.navigate(['/login']);
  }

  async showPopover(ev: any) {
    let id = ev.target.id
    const modal = await this.popover.create({
      component: PlayerpickerPage,
      // event: ev,
      translucent: true,
      componentProps: { context: this.players }
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (this.playerPositions[id].playerPos != "Select Player") {
          this.players.push(this.playerPositions[id].player)
          console.log(this.playerPositions[id].playerPos)
        }
        switch (id) {
          case "1":
            // this.playerPos1 = this.players.filter(x => x.objectId === dataReturned.data.objectId)[0].FirstName
            this.playerPositions[1].posNo = 1;
            this.playerPositions[1].player = dataReturned.data;
            this.playerPositions[1].playerPos =
              dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case "2":
            this.playerPositions[2].posNo = 2;
            this.playerPositions[2].player = dataReturned.data;
            this.playerPositions[2].playerPos =
              dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case "3":
            this.playerPositions[3].posNo = 3;
            this.playerPositions[3].player = dataReturned.data;
            this.playerPositions[3].playerPos =
              dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case "4":
            this.playerPositions[4].posNo = 4;
            this.playerPositions[4].player = dataReturned.data;
            this.playerPositions[4].playerPos =
              dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case "5":
            this.playerPositions[5].posNo = 5;
            this.playerPositions[5].player = dataReturned.data;
            this.playerPositions[5].playerPos =
              dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case "6":
            this.playerPositions[6].posNo = 6;
            this.playerPositions[6].player = dataReturned.data;
            this.playerPositions[6].playerPos =
              dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          default:
            break;
        }
        this.players = this.players.filter(x => x.objectId != dataReturned.data.objectId)
        //console.log('Modal Sent Data :' + dataReturned.data.id);
      }
    });
    return await modal.present();
  }





}

export class MatchUser {
  id: number
  first: string
  last: string
}



