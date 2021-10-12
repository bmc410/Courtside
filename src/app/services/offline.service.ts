import { Injectable, DoBootstrap } from '@angular/core';
import Dexie from 'dexie';
import { OfflineDatabase, IPlayers, IClubs, ITeamPlayers, ITeams, IMatches, IGames, IStats, IPlayByPlay } from '../models/dexie-models';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { PlayerWithId, ClubWithId, TeamWithId, MatchWithId, GameWithId, CourtPosition, pbpPosition, Stat, TeamPlayerWithID } from '../models/appModels';
import { MessageService } from 'primeng/api';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root'
})
export class OfflineService {
  //private subPlayers = new BehaviorSubject<IPlayers[]>();
  public Players: BehaviorSubject<IPlayers[]> = new BehaviorSubject<IPlayers[]>([]);
  public Clubs: BehaviorSubject<IClubs[]> = new BehaviorSubject<IClubs[]>([]);
  public TeamPlayers: BehaviorSubject<ITeamPlayers[]> = new BehaviorSubject<ITeamPlayers[]>([]);
  public Teams: BehaviorSubject<ITeams[]> = new BehaviorSubject<ITeams[]>([]);
  public Matches: BehaviorSubject<IMatches[]> = new BehaviorSubject<IMatches[]>([]);
  public Games: BehaviorSubject<IGames[]> = new BehaviorSubject<IGames[]>([]);
  public Stats: BehaviorSubject<IStats[]> = new BehaviorSubject<IStats[]>([]);
  public PlayByPlay: BehaviorSubject<IPlayByPlay[]> = new BehaviorSubject<IPlayByPlay[]>([]);

  constructor(private messageService: MessageService,
    private offlineDB: OfflineDatabase) {
  }

  //#region ******* Play By Play  */

  clearPBPTable() {
    this.offlineDB.playbyplay.clear().then(result => {
      this.loadPBP()
    })
  }

  getPlayByPlayById(gId: string) {
    return this.offlineDB.playbyplay.orderBy(":id").filter(function (tp) {
      return tp.gameid === gId
    }).toArray()
  }

  getPlayByPlay(): Observable<any> {
    return this.PlayByPlay.asObservable()
  }


  loadPBP() {
    this.offlineDB.playbyplay.toArray().then(results => {
      this.PlayByPlay.next(results);
    })
  }

  addPlayByPlay(g: GameWithId, cp: CourtPosition[], stat: string, p: PlayerWithId[], action: string = "") {
    var rotations: pbpPosition[] = [];
    let pos = cp;
    if (stat === "start") {
      action = "Start [" + cp[1].player.FirstName + ", "
        + cp[2].player.FirstName + ", " + cp[3].player.FirstName + ", "
        + cp[4].player.FirstName + ", " + cp[5].player.FirstName + ", "
        + cp[6].player.FirstName + "]"
    } else if (stat === "sub") {
      action = "Sub [" + p[0].FirstName + " for " + p[1].FirstName + "]"
    } else {
      action = this.getActionFromStat(stat);
      if(p != null && p.length > 0) {
        action += p[0].FirstName + ' ' + p[0].LastName;
      } 
    }

    var player = null;
    var objId = null
    if (p != null) {
      player = p[0];
      objId = player.objectId;
    }

    let pbpObj = {
      id: g.objectId,
      pbpDate: new Date(),
      player: player,
      stattype: stat,
      homescore: g.HomeScore,
      opponentscore: g.OpponentScore,
      action: action,
      rotation: {
        1: cp[1].player.FirstName,
        2: cp[2].player.FirstName,
        3: cp[3].player.FirstName,
        4: cp[4].player.FirstName,
        5: cp[5].player.FirstName,
        6: cp[6].player.FirstName
      },
    }

    pos = pos.splice(1, 6);
    var j = JSON.stringify(pos);
    var d = JSON.parse(j);
    d.forEach(element => {
      let r = new pbpPosition();
      r.posNo = element.posNo;
      r.playerName = element.player.FirstName;
      rotations.push(r);
    });

    var jR = JSON.stringify(rotations);
    const pbp = {
      action: action,
      StatDate: new Date(),
      homescore: g.HomeScore,
      opponentscore: g.OpponentScore,
      playerid: objId,
      stattype: stat,
      rotation: jR,
      gameid: g.objectId,
      objectId: this.createObjectId(),
    } as IPlayByPlay

    this.offlineDB.playbyplay.add(pbp).then(result => {
      this.loadPBP()
    })

  }
  //#endregion

  //#region ******* Stats  */
  clearStatsTable() {
    this.offlineDB.stats.clear().then(result => {
      this.loadStats()
    })
  }


  getActionFromStat(stat: string) {
    var action = ""
    switch (stat.toLowerCase()) {
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
      case "bst":
        action = "Block assist by "
        break;
      case "a":
        action = "Assist by "
        break;
      case "sat":
        action = "Set by "
        break;
      case "sr":
        action = "Serve receive by "
        break;
      case "serve":
        action = "Serve by "
        break;
      case "scoreadjust":
        action = "Score Adjustment "
        break;
      case "pa0":
      case "pa1":
      case "pa2":
      case "pa3":
      case "pa4":
        action = "Pass by "
        break;
      default:
        action = action
        break;
    }
    return action
  }

  incrementStat(stat: Stat, g: GameWithId) {
    var rotations: pbpPosition[] = [];
    for (let index = 1; index < 7; index++) {
      let p = new pbpPosition();
      p.playerName = stat.positions[index].player.FirstName;
      p.posNo = index;
      p.objectId = stat.positions[index].player.objectId
      rotations.push(p);
    }

    var oId = ""
    if (stat.player) {
      oId = stat.player.objectId
    }

    let statObj = new Stat()
    statObj.homeScore = g.HomeScore
    statObj.matchid = stat.matchid
    statObj.gameId = g.objectId
    statObj.gamenumber = stat.gamenumber
    statObj.stattype = stat.stattype
    statObj.homeScore = stat.homeScore
    statObj.opponentScore = g.OpponentScore
    statObj.subs = g.Subs
    statObj.rotation = rotations
    statObj.playerid = oId
    //rotation: stat.positions,
    statObj.stattime = new Date()

    this.createStat(statObj, g);

    if (stat.player) {
      this.messageService.add({ life:1000, severity: 'success', summary: 'Service Message', detail: this.getActionFromStat(stat.stattype) + stat.player.FirstName });
    }
    else if (stat.stattype == "start") {
      this.messageService.add({ life:1000, severity: 'success', summary: 'Starting Lineup Set!', detail: "" });
    }
    else if (stat.stattype == "te") {
      this.messageService.add({ life:1000, severity: 'success', summary: 'Team Error!', detail: "" });
    }
    else if (stat.stattype == "tp") {
      this.messageService.add({ life:1000, severity: 'success', summary: 'Team Point!', detail: "" });
    }
    //this.stattable.add(statObj);
  }

  async createStat(s: Stat, g: GameWithId) {
    var jr = JSON.stringify(s.rotation);
    const st = {} as IStats
    st.GameId = s.gameId
    st.MatchId = s.matchid
    st.HomeScore = g.HomeScore
    st.OpponentScore = g.OpponentScore
    st.PlayerId = s.playerid
    st.StatType = s.stattype
    st.Subs = g.Subs
    st.Rotation = jr
    st.StatDate = new Date()
    st.objectId = this.createObjectId()
    await this.offlineDB.stats.add(st).then(() => {
      this.loadStats()
    })
  }

  
  datetoepoch(date: Date) {
    return Math.round(date.getTime() / 1000);
  }

  getstats(id: string) {
    return this.offlineDB.stats.filter(function (tp) {
      return tp.GameId === id
    }).toArray()
    //return this.firestore.collection("games").doc(g.id).collection("stats", ref => ref.orderBy("statdate")).snapshotChanges();
    //return this.firestore.collection("stats").snapshotChanges();
  }

  getofflinestats(id: string) {
    return JSON.stringify(this.offlineDB.stats.filter(function (tp) {
      return tp.GameId === id
    }).toArray())
  }

  loadStats() {
    this.offlineDB.stats.toArray().then(results => {
      this.Stats.next(results);
      console.log(results)
    })
  }

  getStatsforMatch(matchId: string) {
    return this.offlineDB.stats.filter(function (tp) {
      return tp.MatchId === matchId
    }).toArray()
  }

  //#endregion

  //#region ******* Games  */

  clearGamesTable() {
    this.offlineDB.games.clear().then(result => {
      this.loadGames()
    })
  }

  deleteGame(id: any) {
    return this.offlineDB.games.delete(id).then(() => {
      this.loadGames();
    })
  }

  updateGame(g: GameWithId) {
    return this.offlineDB.games.update(g.objectId,
      { HomeScore: g.HomeScore, OpponentScore: g.OpponentScore, Subs: g.Subs }
    ).then(result => {
      this.loadGames()
    })
  }

  getGameByMatchId(gn: Number, matchId: string) {
    return this.offlineDB.games.filter(function (g: IGames) {
      return g.GameNumber.toString() === gn.toString()
        && g.MatchId === matchId
    }).first()
  }

  createGame(g: IGames) {
    return this.offlineDB.games.add(g).then(() => {
      this.loadGames();
    })
  }
  loadGames() {
    this.offlineDB.games.toArray().then(results => {
      this.Games.next(results);
    })
  }
  getGames(): Observable<any> {
    return this.Games.asObservable();
  }

  getGamesForSync(matchid) {
    return this.offlineDB.games.filter(function (tp) {
      return tp.MatchId === matchid
    }).toArray()
  }

  //#endregion

  //#region ******* Matches  */
  getMatchById(id: string) {
    return this.offlineDB.matches.filter(function (tp) {
      return tp.objectId === id
    }).toArray()
  }

  deleteMatch(id: any) {
    return this.offlineDB.matches.delete(id).then(() => {
      this.loadMatches();
    })
  }

  updateMatch(match:any) {
    return this.offlineDB.matches.update(match.objectId, {
      Home: match.Home, 
      HomeTeamId: match.HomeTeamId, 
      Opponent:match.Opponent, 
      MatchDate:match.MatchDate, 
      HomeTeamLibero:match.HomeTeamLibero
    }).then(() => {
      this.loadMatches();
    })
  }

  createMatch(match: any) {
    return this.offlineDB.matches.add(match).then(() => {
      this.loadMatches();
    })
  }

  clearMatchesTable() {
    this.offlineDB.matches.clear().then(result => {
      this.loadMatches()
    })
  }



  deleteAllMatches() {
    this.offlineDB.matches.clear()
  }

  loadMatches() {
    this.offlineDB.matches.toArray().then(results => {
      this.Matches.next(results);
    })
  }

  getMatchesForSync() {
    return this.offlineDB.matches.toArray()
  }

  getMatches(): Observable<IMatches[]> {
    return this.Matches.asObservable();
  }

  //#endregion

  //#region ******* Teams  */
  clearTeamsTable() {
    this.offlineDB.teams.clear().then(result => {
      this.loadTeams()
    })
  }

  deleteTeam(id: any) {
    return this.offlineDB.teams.delete(id).then(() => {
      this.loadTeams();
    })
  }

  updateTeam(t: ITeams) {
    return this.offlineDB.teams.update(t.objectId, {
      TeamName: t.TeamName,
      Year: t.Year,
      ClubId: t.ClubId
    }).then(() => {
      this.loadTeams();
    })
  }


  addTeam(team: ITeams) {
    //this.db.teams.clear().then(result => {
    return this.offlineDB.teams.add(team).then(result => {
      this.loadTeams();
    })
    //})
  }

  bulkAddTeams(teams: ITeams[]) {
    this.offlineDB.teams.clear().then(result => {
      return this.offlineDB.teams.bulkAdd(teams).then(result => {
        this.loadTeams();
      })
    })
  }
  loadTeams() {
    const tIds: TeamWithId[] = []
    this.offlineDB.teams.toArray().then(results => {
      this.Teams.next(results)
      // results.forEach(element => {
      // const t = new TeamWithId()
      // t.ClubId = element.clubid,
      // t.TeamName = element.teamname,
      // t.Year = element.year,
      // t.objectId = element.objectId
      // tIds.push(t)
      //})
    })
    //this.Teams.next(tIds);
  }

  getTeams(): Observable<any> {
    return this.Teams.asObservable();
  }

  //#endregion

  //#region - Team Players
  clearTeamPlayersTable() {
    this.offlineDB.teamplayers.clear().then(result => {
      this.loadTeamPlayers()
    })
  }

  deleteTeamPlayer(id: any) {
    this.offlineDB.teamplayers.delete(id).then(() => {
      this.loadTeamPlayers();
    })
  }

  updatePlayerJersey(jersey: string, objectId: string) {
    return this.offlineDB.teamplayers.update(objectId,
      { Jersey: jersey }
    ).then(result => {
      this.loadGames()
    })

  }


  loadTeamPlayers() {
    this.offlineDB.teamplayers.toArray().then(results => {
      this.TeamPlayers.next(results);
    })
  }

  getTeamPlayers(): Observable<any> {
    return this.TeamPlayers.asObservable();
  }

  addTeamPlayer(teamplayer: ITeamPlayers) {
    return this.offlineDB.teamplayers.add(teamplayer).then(result => {
      this.loadTeamPlayers();
    })
  }

  bulkAddTeamPlayers(teamplayers: ITeamPlayers[]) {
    this.offlineDB.teamplayers.clear().then(result => {
      return this.offlineDB.teamplayers.bulkAdd(teamplayers).then(result => {
        this.loadTeamPlayers();
      })
    })
  }
  //#endregion

  //#region - Clubs  */
  clearClubsTable() {
    this.offlineDB.clubs.clear().then(result => {
      this.loadClubs()
    })
  }

  deleteClub(id: any) {
    return this.offlineDB.clubs.delete(id).then(() => {
      this.loadClubs();
    })
  }

  loadClubs() {
    const cIds: ClubWithId[] = []
    this.offlineDB.clubs.toArray().then(results => {
      results.forEach(element => {
        const c = new ClubWithId()
        c.objectId = element.objectId,
          c.ClubName = element.ClubName
        cIds.push(c)
      });
      this.Clubs.next(cIds);
    })
  }

  getClubs(): Observable<any> {
    return this.Clubs.asObservable();
  }

  addClub(club: any) {
    return this.offlineDB.clubs.add(club).then(result => {
      this.loadClubs();
    })
  }

  bulkAddClubs(clubs: IClubs[]) {
    this.offlineDB.clubs.clear().then(result => {
      return this.offlineDB.clubs.bulkAdd(clubs).then(result => {
        this.loadClubs();
      })
    })
  }
  //#endregion

  //#region ******* Players  */
  clearPlayersTable() {
    this.offlineDB.players.clear().then(result => {
      this.loadPlayers()
    })
  }

  updatePlayer(player: IPlayers) {
    return this.offlineDB.players.update(player.objectId, {
      FirstName: player.FirstName,
      LastName: player.LastName
    }).then(x => {
      this.loadPlayers();
      //console.log(x)
    })
  }


  bulkAddPlayers(players: IPlayers[]) {
    return this.offlineDB.players.clear().then(result => {
      this.offlineDB.players.bulkAdd(players).then(() => {
        this.loadPlayers();
      })
    })
  }

  addPlayer(player: IPlayers) {
    return this.offlineDB.players.add(player).then(x => {
      this.loadPlayers();
      //console.log(x)
    })
  }


  getTeamPlayersByTeamId(teamId) {
    return this.offlineDB.teamplayers.filter(function (tp) {
      return tp.TeamId === teamId
    }).toArray()
  }

  getPlayers(): Observable<any> {
    return this.Players.asObservable();
  }

  getPlayersNow() {
    return this.offlineDB.players.toArray()
  }

  loadPlayers() {
    const pIds: PlayerWithId[] = []
    this.offlineDB.players.toArray().then(results => {
      results.forEach(element => {
        const p: PlayerWithId = {}
        p.FirstName = element.FirstName
        p.LastName = element.LastName,
          p.objectId = element.objectId,
          p.islibero = false,
          p.fullName = element.FirstName + ' ' + element.LastName
        pIds.push(p)
      });
      this.Players.next(pIds);
    })
  }

  deletePlayer(id: any) {
    return this.offlineDB.players.delete(id).then(() => {
      this.loadPlayers();
    })
  }

  bulkdeletePlayers() {
    return this.offlineDB.players.clear().then(() => {
      return this.loadPlayers();
    })
  }
  //#endregion

  //#region *******CoMMon
  createObjectId() {
    return Guid.create().toString().replace('-','').substr(0,10)
  }
  
  //#endregion



}
