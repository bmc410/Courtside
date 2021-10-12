import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, IonBackButtonDelegate, Platform, PopoverController } from '@ionic/angular';
import { Guid } from 'guid-typescript';
import { GameScore, GameWithId, PlayerWithId, Stat, statEntry, CourtPosition, pbpPosition, MatchUser } from 'src/app/models/appModels';
import { IGames } from 'src/app/models/dexie-models';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatchService } from 'src/app/services/matchservice';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
//import { MatchUser } from '../match/match.page';
import { PlayerpickerPage } from '../playerpicker/playerpicker.page';
import { ScoreboardPage } from '../scoreboard/scoreboard.page';
import { ScoremodalPage } from '../scoremodal/scoremodal.page';

@Component({
  selector: 'app-tabletmatchview',
  templateUrl: './tabletmatchview.page.html',
  styleUrls: ['./tabletmatchview.page.scss'],
})
export class TabletmatchviewPage implements OnInit {
  @ViewChild('backbutton') backButtonDelegate: IonBackButtonDelegate
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
  game: any;
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
  passingscore = -1
  menuitems = [
    {
      label: 'Set Starting Linup',
      icon: 'pi pi-fw pi-users',
      command: () => {
        this.startMatch();
      }
    },
    {
      label: 'Log out',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        this.logoff();
      }
    }];

  // compareFn = (o1, o2) => {
  //   return o1 && o2 ? o1.id === o2.id : o1 === o2;
  // };

  // compareWith = this.compareFn;



  users: MatchUser[] = [];
  allUsers: MatchUser[] = [];
  playerPositions: CourtPosition[] = [];
  match: any;
  context: any;
  title: any;
  homescore: number = 0;
  opponentscore: number = 0;
  statId: number;
  homepointOptions = ["k", "sa", "b"];
  opponentpointOptions = ["he", "be", "bhe", "sre", "se"];
  libero: string = ""

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public matDialog: MatDialog,
    //private matchService: MatchService,
    private route: ActivatedRoute,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    public platform: Platform,
    private router: Router,
    private authenticationService: AuthenticationService,
    private popover: PopoverController) { 
      
      
    }

  ngOnInit() {
    for (let index = 0; index < 7; index++) {
      const p = new PlayerWithId()
      p.FirstName = "Select Player";
      p.jersey = "00"
      const c = new CourtPosition();
      c.playerPos = "Select Player";
      c.posNo = index;
      c.player = p
      this.playerPositions.push(c);
    }

    this.route.queryParams.subscribe(params => {
      this.match = JSON.parse(params['context']);
      this.libero = this.match.HomeTeamLibero
      this.title = this.match.Home + ' vs ' + this.match.Opponent
      this.title += " : GAME " + this.match.gameNumber
    });

    //this.game = new GameWithId()
    this.gameScore = new GameScore();
    this.gameNumber = Number(this.match.gameNumber);
    //this.game.Subs = 0;

    //this.getStatTypes()

    //if(!this.networkService.isConnected) {
    this.getOfflineGameData()
    // }
    // else {
    //   this.getGameData()
    // }


    // if (this.route.snapshot.params.objectId != undefined)
    //   this.match = this.route.snapshot.params;
    // else {
    //   this.router.navigate(['/app/tabs/matches']);
    //   return
    // }
  
  }

 

  async postSR(e, pos) {
    this.openActionSheetController(e, pos)
  }

  async postStat(e, pos) {
    let p = this.playerPositions[pos].player;
    this.incrementStat(pos, p, e.stattype, -1);
    //console.log(e);
  }

  async subPlayer(e) {
    //let p = this.playerPositions[pos].player;
    //this.incrementStat(pos, p, e.target.innerText, -1);
    this.showPopover(e);
  }

  async openActionSheetController(e, pos) {
    this.passingscore = -1
    const actionSheet = await this.actionSheetCtrl.create({
      //header: 'Assessment',
      buttons: [
        {
          text: 'Perfect Pass - 3', handler: () => {
            this.passingscore = 3
          }
        },
        {
          text: 'Good Pass - 2', handler: () => {
            this.passingscore = 2
          }
        },
        {
          text: 'Poor Pass - 1', handler: () => {
            this.passingscore = 1
          }
        },
        {
          text: 'Over-pass/Shank - 0', handler: () => {
            this.passingscore = 0
          }
        }
      ]
    });

    await actionSheet.present();
    actionSheet.onDidDismiss().then(result => {
      var s = e.target.innerText
      if (s == "SR" && this.passingscore == 0) {
        s = "SRE"
      }
      let p = this.playerPositions[pos].player;
      this.incrementStat(pos, p, s, this.passingscore);
    });

  }

  incrementStat(pos: number, player: PlayerWithId, stat: string, passingGrade: number) {
    const playerArray = [];
    var affectedPlayer: PlayerWithId[] = [];
    const s = new Stat();
    s.gamenumber = this.gameNumber;
    s.homeScore = this.game.HomeScore;
    s.matchid = this.match.objectId;
    s.gameId = this.game.objectId
    s.opponentScore = this.game.OpponentScore;
    s.player = player;
    s.pos = pos;
    s.passingGrade = passingGrade
    s.positions = this.playerPositions;
    s.statid = this.statId + 1;
    s.subs = this.game.Subs;
    affectedPlayer.push(player);
    s.stattime = new Date();
    s.stattype = stat;

    if (this.homepointOptions.indexOf(stat.toLowerCase()) > -1) {
      this.updateGame("home", "a", stat)
    } else if (this.opponentpointOptions.indexOf(stat.toLowerCase()) > -1) {
      this.updateGame("opponent", "a", stat)
    }

    this.playerPositions.forEach(val => playerArray.push(Object.assign({}, val)));

    //if(!this.networkService.isConnected) {
    this.offlineservice.incrementStat(s, this.game)
    this.offlineservice.updateGame(this.game)
    this.playerPositions.forEach(val => playerArray.push(Object.assign({}, val)));
    this.offlineservice.addPlayByPlay(this.game, playerArray, stat, affectedPlayer, "")
    // }
    // else {
    //   this.matchService.incrementStat(s, this.game).then(x => {
    //     var json = JSON.stringify(x);
    //     var tpData = JSON.parse(json);
    //     this.matchService.updateGame(this.game)
    //     this.playerPositions.forEach(val => myClonedArray.push(Object.assign({}, val)));
    //     this.matchService.addPlayByPlay(this.game, myClonedArray, stat, affectedPlayer, tpData.objectId)
    //   })
    // }



  }

  openModal() {

    var sbdata = {
      home: this.match.Home,
      away: this.match.Opponent,
      homescore: this.game.HomeScore,
      awayscore: this.game.OpponentScore
    };

    const dialogConfig = new MatDialogConfig();
    // The user can't close the dialog by clicking outside its body
    dialogConfig.disableClose = true;
    //dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    // https://material.angular.io/components/dialog/overview
    const modalDialog = this.matDialog.open(ScoremodalPage, { data: { pageValue: sbdata }, maxWidth: '100%', width: '95%', height: '', position: { top: '2%' } });
    setTimeout(() => {
      this.matDialog.closeAll()
    }, 1000);
  }

  updateGame(team: string, action: any, stat: string) {

    if (team === "home") {
      if (action === "a") {
        
        this.game.HomeScore = this.game.HomeScore + 1
      }
      else {
        this.game.HomeScore = this.game.HomeScore - 1
      }
      //this.openModal()
    }
    else if (team === "opponent") {
      //this.openModal()
      if (action === "a") {
        this.game.OpponentScore = this.game.OpponentScore + 1
      }
      else {
        this.game.OpponentScore = this.game.OpponentScore - 1
      }
      //this.openModal()
    }
    else {
      stat = "sub"
      if (action === "a")
        this.game.Subs = this.game.Subs + 1
      else
        this.game.Subs = this.game.Subs - 1
    }
    this.offlineservice.updateGame(this.game)
  }

  teampoint(ev) {
    var stat = ""

    console.log(ev.currentTarget.id)
    if (ev.currentTarget.id == 'homeinc') {
      stat = "tp"
      this.game.HomeScore = this.game.HomeScore + 1
    } else if (ev.currentTarget.id == 'homedec') {
      stat = "scoreadjust"
      this.game.HomeScore = this.game.HomeScore - 1
    } else if (ev.currentTarget.id == 'vinc') {
      stat = "te"
      this.game.OpponentScore = this.game.OpponentScore + 1
    } else if (ev.currentTarget.id == 'vdec') {
      stat = "scoreadjust"
      this.game.OpponentScore = this.game.OpponentScore - 1
    }

    //var positions: pbpPosition[] = [];
    if (stat != "") {



      let g = new GameWithId();
      let playerArray: any[] = [];
      g.objectId = this.game.objectId;
      g.HomeScore = this.game.HomeScore;
      g.OpponentScore = this.game.OpponentScore
      g.Subs = this.game.Subs
      this.offlineservice.updateGame(g);

      this.playerPositions.forEach(val => playerArray.push(Object.assign({}, val)));

      var st = new Stat();
      st.gamenumber = this.gameNumber;
      st.homeScore = this.game.HomeScore;
      st.matchid = this.match.objectId;
      st.gameId = this.game.objectId
      st.opponentScore = this.game.OpponentScore;
      //st.player = player;
      //st.pos = pos;
      st.passingGrade = -1
      //st.rotation = this.playerPositions;
      st.playerid = 'n/a'
      st.positions = playerArray;
      st.statid = this.statId + 1;
      st.stattime = new Date();
      st.stattype = stat;


      //const s = new Stat();
      //s.playerid = 'n/a'
      //s.stattype = stat
      //s.passingGrade = -1
      //s.rotation = positions; //JSON.stringify(myClonedArray)
      this.offlineservice.incrementStat(st, this.game)
      this.offlineservice.addPlayByPlay(this.game, playerArray, stat, null, null)
      
    }

    // var myClonedArray = [];
    // // this.displayscoreboard = true;
    // var sbData = {
    //   match: { ...this.match },
    //   game: { ...this.game }
    // }
    // const modal = await this.popover.create({
    //   component: ScoreboardPage,
    //   event: ev,
    //   componentProps: { context: sbData }
    // });
    // modal.style.cssText = '--min-width: 100vw';
    // var needsUpdate = false;
    // modal.onDidDismiss().then((d) => {
    //   if (d.data) {
    //     if (d.data && d.data.game.HomeScore != this.game.HomeScore) {
    //       //home score changed
    //       stat = "TP"
    //     }
    //     else if (d.data.game.OpponentScore != this.game.OpponentScore) {
    //       //opponent score changed
    //       stat = "OP"
    //     } else if (d.data.game.subs != this.game.subs) {
    //       //subs
    //       stat = "S"
    //     }

    //     if (stat != "") {
    //       this.playerPositions.forEach(val => myClonedArray.push(Object.assign({}, val)));
    //       //myClonedArray = myClonedArray.slice(1)
    //       this.game.HomeScore = d.data.game.HomeScore;
    //       this.game.OpponentScore = d.data.game.OpponentScore;
    //       this.game.subs = d.data.game.subs;
    //       let g = new GameWithId();
    //       g.objectId = this.game.objectId;
    //       g.HomeScore = this.game.HomeScore;
    //       g.OpponentScore = this.game.OpponentScore
    //       g.subs = this.game.subs
    //       this.matchService.updateGame(g);
    //       const s = new Stat();
    //       s.playerid = 'n/a'
    //       s.stattype = stat
    //       s.passingGrade = -1
    //       s.rotation = JSON.stringify(myClonedArray)
    //       this.matchService.createStat(s, this.game)
    //       this.matchService.addPlayByPlay(this.game, myClonedArray, stat, null, null)
    //     }
    //   }
    // })

    // return await modal.present();
  }

  pad(n) {
    return (n < 10) ? ("0" + n) : n;
  }

  datetoepoch(date: Date) {
    return Math.round(date.getTime() / 1000);
  }

  getOfflineGameData() {
    var _this = this;

    this.offlineservice.loadPlayers();
    this.offlineservice.loadTeamPlayers();
    this.offlineservice.loadGames()
    this.offlineservice.getPlayers().subscribe(results => {
      if (results.length > 0) {
        this.offlineservice.getTeamPlayersByTeamId(this.match.HomeTeamId).then(tPlayers => {
          this.players = [];
          tPlayers.forEach(p => {
            var player = results.filter(x => x.objectId == p.PlayerId)[0]
            var j = tPlayers.filter(x => x.PlayerId == player.objectId)[0]
            let jersey = j.Jersey.toString().padStart(2, "0")
            player.jersey = j.Jersey.toString().padStart(2, "0")
            this.players.push(player);
          });
          this.allPlayers = this.players.slice();

          this.offlineservice.getGameByMatchId(this.match.gameNumber, this.match.objectId,).then(async game => {
            //var json = JSON.stringify(result);
            //var game = JSON.parse(json);
            _this.game = game
            // if (game.length == 0) {
            //   let g = new GameWithId()
            //   g.GameNumber = this.gameNumber
            //   g.MatchId = this.match.objectId
            //   g.OpponentScore = 0
            //   g.HomeScore = 0
            //   g.Subs = 0
            //   g.objectId = Guid.create().toString().replace("-", "").slice(0, 10),
            //     this.offlineservice.createGame(g).then(result => {
            //       //this.offlineservice.getGameByMatchId(this.gameNumber, this.match.objectId).then(games => {
            //       //console.log(games)
            //       //var j = JSON.stringify(games);
            //       //var game = JSON.parse(j);
            //       this.game.objectId = g.objectId;
            //       this.game.HomeScore = 0;
            //       this.game.OpponentScore = 0;
            //       this.game.Subs = 0;
            //       this.game.MatchId = g.MatchId;
            //       this.game.GameNumber = this.gameNumber;
            //     })
            //   //})
            // }
            //else {
              //this.game = new GameWithId()
              //this.game.objectId = game[0].objectId

              await this.offlineservice.getstats(this.game.objectId).then(stats => {
                stats.forEach(function (s) {
                  var rotation = JSON.parse(s.Rotation);
                  let stat: statEntry = {
                    //statid: Guid.create().toString(),
                    homescore: s.HomeScore,
                    matchid: _this.match.objectId,
                    gamenumber: _this.match.gameNumber,
                    StatType: s.StatType,
                    PlayerId: s.PlayerId,
                    statdate: _this.datetoepoch(s.StatDate),
                    //pos: Map<any,any>,
                    id: s.objectId,
                    opponentscore: s.OpponentScore,
                    rotation: rotation,
                    subs: s.Subs
                  }
                  _this.stats.push(stat);
                });

                if (this.stats && this.stats.length > 0) {
                  //this.startMatch();
                  this.stats = this.stats.sort((a, b) => (a.statdate < b.statdate) ? 1 : -1)
                  var r = this.stats[0] //the first record is always the latest
                  this.game.HomeScore = r.homescore;
                  this.game.OpponentScore = r.opponentscore;
                  this.game.Subs = r.subs;
                  var pos = r.rotation
                  for (let i = 0; i < 6; i++) {
                    var p1 = this.allPlayers.filter(p => p.objectId == pos[i].objectId)[0]
                    this.playerPositions[i + 1].posNo = pos[i].posNo;
                    this.playerPositions[i + 1].player = p1;
                    this.playerPositions[i + 1].playerPos = this.playerDisplay(p1)
                    p1.FirstName + " - " + p1.jersey;
                    this.players = this.players.filter(x => x.objectId != p1.objectId)
                  }
                }
                else {
                  this.game.HomeScore = 0;
                  this.game.OpponentScore = 0;
                  this.game.Subs = 0;
                }
              });
              this.game.GameNumber = this.match.gameNumber;
              this.game.objectId = game[0].objectId;
              this.game.Subs = game[0].Subs;
            //}
          })
        })
      }
    });
  }

  // async getStatTypes() {
  //   await this.matchService.getStatTypes().then(data => {
  //     //console.log(JSON.stringify(data))
  //   })
  // }

  // async getGameData() {
  //   var _this = this;
  //   await this.matchService.getPlayers().then(async allPlayers => {
  //     var json = JSON.stringify(allPlayers);
  //     var tpData = JSON.parse(json);
  //     await this.matchService.getPlayersByTeamId(this.match.HomeTeamId).then(async teamPlayers => {
  //       var json1 = JSON.stringify(teamPlayers);
  //       var tpData1 = JSON.parse(json1);
  //       tpData1.forEach(p => {
  //         var player = tpData.filter(x => x.objectId == p.PlayerId)[0]
  //         player.jersey = this.pad(tpData1.filter(x => x.PlayerId == player.objectId)[0].Jersey)
  //         this.players.push(player);
  //       });

  //       this.allPlayers = this.players.slice();

  //       await this.matchService.getGameForMatchByNumber(this.match.objectId, this.match.gameNumber).then(async result => {
  //         var json = JSON.stringify(result);
  //         var game = JSON.parse(json);
  //         if (game.length == 0) {
  //           let g = new GameWithId()
  //           g.GameNumber = this.gameNumber
  //           g.MatchId = this.match.objectId
  //           g.OpponentScore = 0
  //           g.HomeScore = 0
  //           g.Subs = 0
  //           this.matchService.createGame(g).subscribe(result => {
  //             this.matchService.getGameForMatchByNumber(this.match.objectId, this.gameNumber).then(result => {
  //               var j = JSON.stringify(result);
  //               var game = JSON.parse(j);
  //               this.game.objectId = game[0].objectId;
  //               this.game.HomeScore = 0;
  //               this.game.OpponentScore = 0;
  //               this.game.Subs = 0;
  //               this.game.GameNumber = this.gameNumber;
  //             })
  //           })
  //         }

  //         else {
  //           this.game = game[0];
  //           await this.matchService.getPlayByPlay(this.game.objectId).then(data => {
  //             var j: any = JSON.stringify(data);
  //             var pbp = JSON.parse(j);
  //             var rotations: pbpPosition[] = JSON.parse(pbp[0].rotation)
  //             rotations.forEach(element => {
  //               var p1 = this.allPlayers.filter(p => p.objectId == element.playerName)[0]
  //               if (p1) {
  //                 this.playerPositions[element.posNo].posNo = element.posNo;
  //                 this.playerPositions[element.posNo].player = p1;
  //                 this.playerPositions[element.posNo].playerPos = this.playerDisplay(p1)
  //                 p1.FirstName + " - " + p1.jersey;
  //                 this.players = this.players.filter(x => x.objectId != p1.objectId)
  //               }
  //             });

  //             this.matchService.getstats(this.game.objectId).then(data => {
  //               var j = JSON.stringify(data);
  //               var stats = JSON.parse(j);
  //               stats.forEach(function (s) {
  //                 var rotation = JSON.parse(s.Rotation);
  //                 let stat = {
  //                   statid: s.GameId,
  //                   homescore: s.HomeScore,
  //                   matchid: s.OpponentScore,
  //                   gamenumber: _this.match.gameNumber,
  //                   stattype: s.StatType,
  //                   playerid: s.PlayerId,
  //                   statdate: s.createdAt,
  //                   //pos: Map<any,any>,
  //                   id: s.objectId,
  //                   opponentscore: s.OpponentScore,
  //                   rotation: rotation,
  //                   subs: s.Subs
  //                 }
  //                 _this.stats.push(stat);
  //               });

  //               if (this.stats && this.stats.length > 0) {
  //                 this.startMatch();
  //                 var r = this.stats[0]
  //                 this.game.HomeScore = r.homescore;
  //                 this.game.OpponentScore = r.opponentscore;
  //                 this.game.Subs = r.subs;
  //                 var pos = r.rotation
  //                 for (let i = 0; i < 6; i++) {
  //                   var p1 = this.allPlayers.filter(p => p.objectId == pos[i].objectId)[0]
  //                   if (p1) {
  //                     this.playerPositions[i + 1].posNo = pos[i].posNo;
  //                     this.playerPositions[i + 1].player = p1;
  //                     this.playerPositions[i + 1].playerPos = this.playerDisplay(p1)
  //                     p1.FirstName + " - " + p1.jersey;
  //                     this.players = this.players.filter(x => x.objectId != p1.objectId)
  //                   }
  //                 }
  //               }
  //             });
  //             this.game.GameNumber = this.match.gameNumber;
  //             this.game.objectId = game[0].objectId;
  //             this.game.Subs = game[0].Subs;
  //           });
  //         }
  //       })
  //     })
  //   })
  // }

  startMatch() {
    const s = new Stat();
    s.gamenumber = this.gameNumber;
    s.homeScore = 0;
    s.matchid = this.match.objectId;
    s.opponentScore = 0;
    s.player = null;
    s.pos = -1;
    s.passingGrade = -1
    s.positions = this.playerPositions;
    s.statid = this.statId + 1;
    //affectedPlayer.push(player);
    //s.stattime = new Date();
    s.stattype = "start";
    //this.createStat(statObj,g);
    //this.liberoDisabled = true;
    //this.startHidden = true;
    const cp = Object.assign([], this.playerPositions);
    if (this.stats.length == 0) {
      //if(!this.networkService.isConnected) {
      this.offlineservice.addPlayByPlay(this.game, cp, "start", null)
      this.offlineservice.incrementStat(s, this.game)

      // } else {
      //   this.matchService.addPlayByPlay(this.game, cp, "start", null)
      //   this.matchService.incrementStat(s, this.game).then(x => {

      //   })
      // }
    }
  }

  logoff() {
    this.authenticationService.logout();
    //window.location.href = '/login';
    this.router.navigate(['/login']);
  }

  playerDisplay(dataReturned) {
    if (dataReturned) {
      if (dataReturned.jersey) {
        return dataReturned.FirstName + " - " + dataReturned.jersey;
      }
      else {
        return dataReturned.FirstName
      }
    }
  }

  async showPopover(pos: any) {
    let id = pos
    var param = {
      players: this.players,
      libero: this.match.HomeTeamLibero
    }
    const modal = await this.popover.create({
      component: PlayerpickerPage,
      // event: ev,
      translucent: true,
      componentProps: { context: param },
      cssClass: 'pop-over-style'
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned.data !== undefined) {
        if (this.playerPositions[id].playerPos != "Select Player") {
          var leavingPlayer: PlayerWithId = this.playerPositions[id].player;
          this.players.push(this.playerPositions[id].player)
          //console.log(this.playerPositions[id].playerPos)
        }
        switch (id) {
          case 1:
            // this.playerPos1 = this.players.filter(x => x.objectId === dataReturned.data.objectId)[0].FirstName
            this.playerPositions[1].posNo = 1;
            this.playerPositions[1].player = dataReturned.data;
            this.playerPositions[1].playerPos = this.playerDisplay(dataReturned.data)
            //dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case 2:
            this.playerPositions[2].posNo = 2;
            this.playerPositions[2].player = dataReturned.data;
            this.playerPositions[2].playerPos = this.playerDisplay(dataReturned.data)
            //dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case 3:
            this.playerPositions[3].posNo = 3;
            this.playerPositions[3].player = dataReturned.data;
            this.playerPositions[3].playerPos = this.playerDisplay(dataReturned.data)
            //dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case 4:
            this.playerPositions[4].posNo = 4;
            this.playerPositions[4].player = dataReturned.data;
            this.playerPositions[4].playerPos = this.playerDisplay(dataReturned.data)
            //dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case 5:
            this.playerPositions[5].posNo = 5;
            this.playerPositions[5].player = dataReturned.data;
            this.playerPositions[5].playerPos = this.playerDisplay(dataReturned.data)
            //dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          case 6:
            this.playerPositions[6].posNo = 6;
            this.playerPositions[6].player = dataReturned.data;
            this.playerPositions[6].playerPos = this.playerDisplay(dataReturned.data)
            //dataReturned.data.FirstName + " - " + dataReturned.data.jersey;
            break;
          default:
            break;
        }
        this.players = this.players.filter(x => x.objectId != dataReturned.data.objectId)
        if(leavingPlayer) {
          if(dataReturned.data.objectId != this.libero && leavingPlayer.objectId != this.libero) {
            this.updateGame(this.match.HomeTeamId, "a", "sub", )
          }
        }
      }
    });
    return await modal.present();
  }

  rotate() {
    let positionsFilled = true;
    for (let index = 1; index < 7; index++) {
      if (!this.playerPositions[index]) {
        positionsFilled = false;
        break;
      }
    }

    if (!positionsFilled) {
      return;
    }

    const tempPlayer = this.playerPositions[1];
    this.playerPositions[1] = this.playerPositions[2];
    this.playerPositions[2] = this.playerPositions[3];
    this.playerPositions[3] = this.playerPositions[4];
    this.playerPositions[4] = this.playerPositions[5];
    this.playerPositions[5] = this.playerPositions[6];
    this.playerPositions[6] = tempPlayer;
  }

}
