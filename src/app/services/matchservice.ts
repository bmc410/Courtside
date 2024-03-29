import { Injectable, OnInit } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, BehaviorSubject, Subscriber, of, from, forkJoin } from "rxjs";
import { map } from 'rxjs/operators';
import {
  Match,
  Stat,
  statModel,
  PlayerWithId,
  Player,
  statEntry,
  Game,
  GameWithId,
  MatchWithId,
  PlayerNib,
  CourtPosition,
  PointPlay,
  TeamWithId,
  TeamPlayer,
  pbpPosition,
  TeamPlayerWithID
} from "../models/appModels";
import Dexie from "dexie";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection
} from "@angular/fire/firestore";
import { Guid } from "guid-typescript";

import * as firebase from "firebase";
import "firebase/firestore";
import { MessageService } from 'primeng/api';
import { Action } from 'rxjs/internal/scheduler/Action';
import { Parse } from 'parse';
import { OfflineService } from './offline.service';
import { ToastController } from '@ionic/angular';
//import { url } from 'inspector';


@Injectable({
  providedIn: "root"
})
export class MatchService {
  //matchtable: Dexie.Table<Match, number>;
  items: Observable<any[]>;
  dbPlayers: Observable<any>;
  dbMatches: Observable<any>;
  dbStats: Observable<any>;
  dbGames: Observable<any>;
  dbTeams: Observable<any>;
  match: Match[] = [];
  public Matches: BehaviorSubject<MatchWithId[]> = new BehaviorSubject<MatchWithId[]>([]);
  public Teams: BehaviorSubject<TeamWithId[]> = new BehaviorSubject<TeamWithId[]>([]);
  public TeamPlayers: BehaviorSubject<TeamPlayerWithID[]> = new BehaviorSubject<TeamPlayerWithID[]>([]);
  public Players: BehaviorSubject<PlayerWithId[]> = new BehaviorSubject<PlayerWithId[]>([]);

  //mappedPos = new Array();

  constructor(
    public toastController: ToastController,
    private firestore: AngularFirestore,
    private http: HttpClient,
    private messageService: MessageService,
    private odb: OfflineService
  ) {
    this._gameData$ = new BehaviorSubject(null);
    this.initParse()
    //this.loadOfflinePlayers()
    //this.addPlayer()
  }

  private itemDoc: AngularFirestoreDocument<PlayerWithId>;

  private players: PlayerWithId[] = [];
  private matches: MatchWithId[] = [];
  private stats: Stat[] = [];
  private games: GameWithId[] = [];
  private teams: TeamWithId[] = [];

  //private db: any;
  //private _gamewithId: GameWithId;
  //public game: BehaviorSubject<GameWithId> = new BehaviorSubject<GameWithId>({});

  private _gameData$: BehaviorSubject<GameWithId>;
  public _gameData: GameWithId;

  initParse() {
    Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
    Parse.initialize(
      '6jtb78oSAiGeNv2mcJTN0h039TxkJh4HDrWBz7RT', // This is your Application ID
      'bRolkvWkFSewPWnlqQOaaRTpgT16ILr6r7PnU6AY', // This is your Javascript key
      'dHvEstEM97ue9pBcTcW8ofNyqS2ERqT7kg4CnYhX' // This is your Master key (never use it in the frontend)
    );
  }

//#region OFFLINE FUNCTIONALITY
  // loadOfflinePlayers() {
  //   this.odb.getPlayers().subscribe(x => {
  //     console.log(x);
  //   });
  // }

  // addPlayer() {
  //   this.odb.addPlayer(new Player("8", "Bill","McCoy",false, "MVDuxR2pYr")).then(x => {
  //     this.loadOfflinePlayers()
  //   });
  // }

//#endregion


  //#region ONLINE FUNCTIONALITY
  //#region ******* Matches  */

  deleteMatch(mId: string) {
    const Matches = Parse.Object.extend('Matches');
    const query = new Parse.Query(Matches);
    // here you put the objectId that you want to delete
    return query.get(mId).then((object) => {
      //var json = JSON.stringify(object);
      //var d = JSON.parse(json);
      return object.destroy()

      // .then((response) => {
      //   var json = JSON.stringify(response);
      //   var d = JSON.parse(json);
      //   this.getAllGameForMatch(mId).then(result => {
      //     var json = JSON.stringify(result);
      //     var d = JSON.parse(json);
      //     d.forEach(element => {
      //       this.deleteGameById(element.objectId)
      //       this.getPlayByPlay(element.objectId).then(result => {
      //         var json = JSON.stringify(result);
      //         var d = JSON.parse(json);
      //         d.forEach(element => {
      //           this.deletePBPById(element.objectId)
      //         })
      //         this.getstats(element.objectId).then(result => {
      //           var json = JSON.stringify(result);
      //           var d = JSON.parse(json);
      //           d.forEach(element => {
      //             this.deleteStat(element.objectId)
      //           })
      //           this.loadMatches()
      //         })
      //       })
      //     });
      //   })
      // })
    });
  }

  saveMatch(match: MatchWithId) {
    if (match.objectId == 'undefined' || match.objectId == null || match.objectId == "") {
      match.objectId = Guid.create().toString().replace('-','').substr(0,10)
      return this.createMatch(match);
    } else {
      return this.updateMatch(match);
    }
  }

  getMatches() {
    const Matches = Parse.Object.extend('Matches');
    const query = new Parse.Query(Matches);
    return query.find();
  }

  loadMatches() {
    const Matches = Parse.Object.extend('Matches');
    const query = new Parse.Query(Matches);
    return query.find().then(result => {
      this.Matches.next(result);
    })
  }

  getMatchesAsync() {
    return this.Matches.asObservable()
  }

  getMatchById(id: string) {
    const Matches = Parse.Object.extend('Matches');
    const query = new Parse.Query(Matches);
    query.equalTo("objectId", id);
    return query.find();
    //return this.firestore.collection("players").snapshotChanges();
  }

  updateMatch(m: MatchWithId) {
    const Matches = Parse.Object.extend('Matches');
    const query = new Parse.Query(Matches);
    // here you put the objectId that you want to update
    return query.get(m.objectId).then((object) => {
      object.set('Home', m.Home);
      object.set('Opponent', m.Opponent);
      object.set('MatchDate', m.MatchDate);
      object.set('HomeTeamId', m.HomeTeamId);
      return object.save()
    });
  }

  async createMatch(m: MatchWithId) {
    const Matches = Parse.Object.extend('Matches');
    const myNewObject = new Matches();

    let newDate = new Date(m.MatchDate);
    var md = this.DateToYYYYMMDD(newDate);
    myNewObject.set('Home', m.Home);
    myNewObject.set('Opponent', m.Opponent);
    myNewObject.set('MatchDate', md);
    myNewObject.set('HomeTeamId', m.HomeTeamId);

    const result = await myNewObject.save().then(x => {
      return x
    })
    return result
  }
  //#endregion

  //#region ******* Games  */

  deleteGameById(gId) {
    const Games = Parse.Object.extend('Games');
    const query = new Parse.Query(Games);
    // here you put the objectId that you want to delete
    query.get(gId).then((object) => {
      object.destroy()
    });
  }

  getAllGameForMatch(matchId: string) {
    const Games = Parse.Object.extend('Games');
    const query = new Parse.Query(Games);
    query.equalTo("MatchId", matchId);
    return query.find();
  }

  getGameForMatchByNumber(matchId: string, gameNumber: number) {
    const Games = Parse.Object.extend('Games');
    const query = new Parse.Query(Games);
    query.equalTo("MatchId", matchId);
    query.equalTo("GameNumber", Number(gameNumber));
    return query.find();
  }
  updateGame(g: GameWithId) {
    const Games = Parse.Object.extend('Games');
    const query = new Parse.Query(Games);
    // here you put the objectId that you want to update
    return from(query.get(g.objectId).then((object) => {
      object.set('HomeScore', g.HomeScore);
      object.set('OpponentScore', g.OpponentScore);
      object.set('Subs', g.Subs);
      object.save();
    }));
  }
  getGameId(gn: Number, matchId: string) {
    const Games = Parse.Object.extend('Games');
    const query = new Parse.Query(Games);
    query.equalTo("GameNumber", gn);
    query.equalTo("MatchId", matchId);
    return query.find()
  }
  async createGame(g: GameWithId) {
    const Games = Parse.Object.extend('Games');
    const newGame = new Games();

    newGame.set('GameNumber', Number(g.GameNumber));
    newGame.set('MatchId', g.MatchId);
    newGame.set('HomeScore', g.HomeScore);
    newGame.set('OpponentScore', g.OpponentScore);
    newGame.set('Subs', g.Subs);

    const result = await newGame.save().then(game => {
      return game
    })
    return result
  }

  //#endregion

  //#region ******* Players  */

  loadPlayers() {
    const players = Parse.Object.extend('Players');
    const query = new Parse.Query(players);
    return query.find().then(result => {
      this.Players.next(result);
    })
  }

  getPlayerById(objectId) {
    const Players = Parse.Object.extend('Players');
    const query = new Parse.Query(Players);
    query.equalTo("objectId", objectId);
    return query.find();
  }
  getPlayersAsync() {
    return this.Players.asObservable()
  }

  getPlayers() {
    const Players = Parse.Object.extend('Players');
    const query = new Parse.Query(Players);
    return query.find();
  }
  getAllPlayers() {
    const Players = Parse.Object.extend('Players');
    const query = new Parse.Query(Players);
    return query.find();
  }

  savePlayer(p: any) {
    if (!p.objectId) {
      return this.createPlayer(p)
    } else {
      return this.updatePlayer(p)
    }
  }
  updatePlayer(p: any) {
    const Players = Parse.Object.extend('Players');
    const query = new Parse.Query(Players);
    // here you put the objectId that you want to update
    return query.get(p.objectId).then((object) => {
      object.set('FirstName', p.FirstName);
      object.set('LastName', p.LastName);
      object.save()
    })
  }
  createPlayer(p: any) {
    const Players = Parse.Object.extend('Players');
    const myNewObject = new Players();

    myNewObject.set('FirstName', p.FirstName);
    myNewObject.set('LastName', p.LastName);

    return myNewObject.save()

  }

  deletePlayer(pId: any) {
    const Players = Parse.Object.extend('Players');
    const query = new Parse.Query(Players);
    // here you put the objectId that you want to delete
    return query.get(pId).then((object) => {
      return object.destroy()
    })
  }
  //#endregion

  //#region ******* PlayByPlay  */

  deletePBPByStatId(statId) {
    this.getBystatId(statId).then(x => {
      var j = JSON.stringify(x);
      var d = JSON.parse(j)[0];
      const PlayByPlay = Parse.Object.extend('PlayByPlay');
      const query = new Parse.Query(PlayByPlay);

      // here you put the objectId that you want to delete
      return query.get(d.objectId).then((object) => {
        return object.destroy()
      });

    })


  }

  getBystatId(statid) {
    const PlayByPlay = Parse.Object.extend('PlayByPlay');
    const query = new Parse.Query(PlayByPlay);
    query.equalTo("statid", statid);
    return query.find()
  }


  deletePBPById(pbpId) {
    const PlayByPlay = Parse.Object.extend('PlayByPlay');
    const query = new Parse.Query(PlayByPlay);
    // here you put the objectId that you want to delete
    query.get(pbpId).then((object) => {
      object.destroy()
    });
  }

  getPlayByPlay(gId: string) {
    const PlayByPlay = Parse.Object.extend('PlayByPlay');
    const query = new Parse.Query(PlayByPlay);
    query.equalTo("gameId", gId);
    return query.find()
  }

  addPlayByPlay(g: GameWithId, cp: any[], stat: any, p: any, statid: string = "") {
    var rotations: pbpPosition[] = [];
    let pos = cp;
    var poositions = JSON.stringify(cp);
    var action = ""
    if (stat.stattype === "start") {
      action = "Start [" + cp[0].playerName + ", "
        + cp[1].playerName + ", " + cp[2].playerName + ", "
        + cp[3].playerName + ", " + cp[4].playerName + ", "
        + cp[5].playerName + "]"
    } else if (stat.stattype === "sub") {
      action = "Sub [" + p[0].FirstName + " for " + p[1].FirstName + "]"
    } else if (stat.stattype === "TP") {
      action = "Opponent Error - Team Point"
    } else if (stat.stattype === "OP") {
      action = "Team Error - Opponent Point"
    } else if (stat.stattype === "S") {
      action = "Home Team - Sub"
    } else if (stat.stattype === "SAA") {
      action = "Score Adjustment"
    } else {
      action = this.getActionFromStat(stat.stattype, -1) + p.FirstName + ' ' + p.LastName;
    }

    var player = null;
    var objId = null
    if (p != null) {
      objId = p.objectId;
    }

    const PlayByPlay = Parse.Object.extend('PlayByPlay');
    const myNewObject = new PlayByPlay();

    myNewObject.set('action', action);
    myNewObject.set('homescore', g.HomeScore);
    myNewObject.set('opponentscore', g.OpponentScore);
    myNewObject.set('playerId', objId);
    myNewObject.set('stattype', stat.stattype);
    myNewObject.set('collectdate', stat.StatDate);
    myNewObject.set('rotation', poositions);
    myNewObject.set('gameId', g.objectId);
    myNewObject.set('statid', statid);

    return myNewObject.save();
    //this.messageService.add({severity:'success', summary:'Service Message', detail:'Via MessageService'});
    //return this.createPBPInFirestore(pbpObj);

  }

  syncPlayByPlay(g: GameWithId, rotation: string, stat: string, pId: string, action: string = "") {

    const PlayByPlay = Parse.Object.extend('PlayByPlay');
    const myNewObject = new PlayByPlay();

    myNewObject.set('action', action);
    myNewObject.set('homescore', g.HomeScore);
    myNewObject.set('opponentscore', g.OpponentScore);
    myNewObject.set('playerId', pId);
    myNewObject.set('stattype', stat);
    myNewObject.set('rotation', rotation);
    myNewObject.set('gameId', g.objectId);

    myNewObject.save();
  }

  //#endregion

  //#region ******* Stats  */

  getStatTypes() {
    const Players = Parse.Object.extend('StatTypes');
    const query = new Parse.Query(Players);
    return query.find();
  }

  deleteStat(sId) {
    const Stats = Parse.Object.extend('Stats');
    const query = new Parse.Query(Stats);
    return query.get(sId).then((object) => {
      return object.destroy()
    })
  }

  async incrementStat(stat: Stat, g: GameWithId) {
    var rotations: pbpPosition[] = [];
    for (let index = 1; index < 7; index++) {
      let p = new pbpPosition();
      p.playerName = stat.positions[index].player.FirstName;
      p.posNo = index;
      p.objectId = stat.positions[index].player.objectId
      rotations.push(p);
    }

    if (stat.stattype == "SR" && stat.passingGrade == 0) {
      stat.stattype = "SRE"
    }

    let statObj = {
      //statorder: await this.getMaxStatId(),
      matchid: stat.matchid,
      gamenumber: stat.gamenumber,
      stattype: stat.stattype,
      homescore: g.HomeScore,
      passingGrade: stat.passingGrade,
      opponentscore: g.OpponentScore,
      subs: g.Subs,
      rotation: rotations,
      playerid: stat.player.objectId,
      //rotation: stat.positions,
      statdate: this.datetoepoch(new Date())
    };
    const toast = await this.toastController.create({
      color: 'dark',
      duration: 1000,
      message: this.getActionFromStat(stat.stattype, stat.passingGrade) + stat.player.FirstName
    });

    await toast.present();
    return this.createStat(statObj, g);

    //this.messageService.add({ severity: 'success', summary: 'Service Message', detail: this.getActionFromStat(stat.stattype) + stat.player.FirstName });
    //this.stattable.add(statObj);
  }
  getstats(id: string) {
    const Stats = Parse.Object.extend('Stats');
    const query = new Parse.Query(Stats);
    query.equalTo("GameId", id);
    query.descending("createdAt");
    return query.find();
  }

  getActionFromStat(stat: string, pg: number) {
    var action = ""
    switch (stat.toLowerCase()) {
      case "serve":
        action = "Serve by "
        break;
      case "k":
        action = "Kill by "
        break;
      case "he":
        action = "Attack error by "
        break;
      case "be":
        action = "Block error by "
        break;
      case "bhe":
        action = "Ball handling error by "
        break;
      case "sr":
        if (pg > 0) {
          action = "Serve receive (" + pg.toString() + ")" + " by "
        } else {
          action = "Serve receive by "
        }
        break;
      case "sre":
        action = "Serve receive error by "
        break;
      case "se":
        action = "Service error by "
        break;
      case "te":
        action = "Team error"
        break;
      case "tp":
        action = "Team point"
        break;
      case "sa":
        action = "Service ace by "
        break;
      case "bt":
        action = "Block touch by "
        break;
      case "h":
        action = "Attack by "
        break;
      case "d":
        action = "Dig by "
        break;
      case "b":
        action = "Block by "
        break;
      case "a":
        action = "Assist by "
        break;
      default:
        action = action
        break;
    }
    return action
  }
  createStat(stat: any, g: GameWithId) {
    var rotations: pbpPosition[] = [];
    var passingGrade: Number = 0;
    var jr = JSON.stringify(stat.rotation);
    const Stats = Parse.Object.extend('Stats');
    const myNewObject = new Stats();
    myNewObject.set('GameId', g.objectId);
    myNewObject.set('HomeScore', stat.HomeScore);
    myNewObject.set('OpponentScore', stat.OpponentScore);
    myNewObject.set('PlayerId', stat.PlayerId);
    myNewObject.set('StatType', stat.StatType);
    myNewObject.set('Subs', stat.Subs);
    myNewObject.set('Rotation', stat.Rotation);
    if(stat.StatType.includes('pa')) {
      passingGrade = Number(stat.StatType.substring(2))
      myNewObject.set('passingGrade', passingGrade);
    }

    return myNewObject.save()
    //return this.firestore.collection("games").doc(g.objectId).collection("stats").add(stat);
  }
  //#endregion

  //#region ******* Teams  */
  deleteTeam(teamId) {
    const Teams = Parse.Object.extend('Teams');
    const query = new Parse.Query(Teams);
    // here you put the objectId that you want to delete
    return query.get(teamId).then((object) => {
      return object.destroy()
    });
  }

  loadTeams() {
    const Teams = Parse.Object.extend('Teams');
    const query = new Parse.Query(Teams);
    return query.find().then(result => {
      this.Teams.next(result);
    })
  }


  getTeamsAsync() {
    return this.Teams.asObservable()
  }

  getTeams() {
    const Teams = Parse.Object.extend('Teams');
    const query = new Parse.Query(Teams);
    return query.find();
  }
  upDateTeam(t: TeamWithId) {
    const Teams = Parse.Object.extend('Teams');
    const query = new Parse.Query(Teams);
    // here you put the objectId that you want to update
    return from(query.get(t.objectId).then((object) => {
      object.set('TeamName', t.TeamName);
      object.set('Year', t.Year);
      object.set('ClubId', t.ClubId);
      object.save()
    }));
  }
  createTeam(t: TeamWithId) {
    const Teams = Parse.Object.extend('Teams');
    const newTeam = new Teams();
    newTeam.set('objectId', t.objectId);
    newTeam.set('TeamName', t.TeamName);
    newTeam.set('Year', 2020);
    newTeam.set('ClubId', t.ClubId);

    return from(newTeam.save()).pipe(map(result => result));;

  }

  //#endregion

  //#region ******* Teams Players  */

  getTeamPlayersAsync() {
    return this.TeamPlayers.asObservable()
  }

  getPlayersByTeamId(teamId: string) {
    const Teams = Parse.Object.extend('TeamPlayers')
    const query = new Parse.Query(Teams);
    query.equalTo("TeamId", teamId);
    return query.find();

  }
  updatePlayerJersey(jersey: string, objectId: string) {
    const TeamPlayers = Parse.Object.extend('TeamPlayers');
    const query = new Parse.Query(TeamPlayers);
    // here you put the objectId that you want to update
    return from(query.get(objectId).then((object) => {
      object.set('Jersey', jersey);
      return object.save()
    }))
  }

  loadTeamPlayers(teamId) {
    this.TeamPlayers.next(null)
    const TeamPlayers = Parse.Object.extend('TeamPlayers');
    const query = new Parse.Query(TeamPlayers);
    query.equalTo("TeamId", teamId);
    return query.find().then(result => {
      this.TeamPlayers.next(result);
    })
  }

  deleteTeamPlayer(id) {
    const TeamPlayers = Parse.Object.extend('TeamPlayers');
    const query = new Parse.Query(TeamPlayers);
    // here you put the objectId that you want to delete
    return query.get(id).then((object) => {
      return object.destroy()
    });
  }
  addPlayersToTeam(players: PlayerWithId[], teamId: string): Observable<any[]> {
    var arrayOfResponses: Array<any> = [];

    players.forEach(p => {
      const TeamPlayers = Parse.Object.extend('TeamPlayers');
      const myNewObject = new TeamPlayers();
      myNewObject.set('PlayerId', p.objectId);
      myNewObject.set('TeamId', teamId);
      var resp = from(myNewObject.save())
      arrayOfResponses.push(resp);
    });
    return forkJoin(arrayOfResponses);
  }

  getAllTeamPlayers() {
    const Teams = Parse.Object.extend('TeamPlayers')
    const query = new Parse.Query(Teams);
    return query.find();
  }
  //#endregion

  //#region ******* Clubs  */
  getClubs() {
    const Clubs = Parse.Object.extend('Clubs');
    const query = new Parse.Query(Clubs);
    return query.find();
  }

  //#endregion

  //#region ******* Utilities  */
  //#endregion


  DateToYYYYMMDD(Date: Date): string {
    let DS: string = ('0' + (Date.getMonth() + 1)).slice(-2)
      + '/' + ('0' + Date.getDate()).slice(-2)
      + '/' + Date.getFullYear()
    return DS
  }

  datefromepoch(epoch: any) {
    let x: number = epoch.seconds;
    console.log(epoch);
    var d = new Date(0); // The 0 there is the key, which sets the date to the epoch
    d.setUTCSeconds(epoch.seconds);
    console.log(d);
    return d;
  }

  datetoepoch(date: Date) {
    return Math.round(date.getTime() / 1000);
  }
  //#endregion

}
