//import { staticViewQueryIds } from '@angular/compiler';

export class matchscore{
  hometeam?: string
  opponent?: string
  gamedata?: gamescore[] = []
}

export interface PBP {
  action: string;
  homescore: number;
  opponentscore: number;
  playerId?: any;
  stattype: string;
  rotation: string;
  gameId: string;
  statid: string;
  createdAt: Date;
  updatedAt: Date;
  objectId: string;
}

export class teamstats {
  kills?: number
  errors?: number
  attempts?: number
  hitpercentage?: number
  assists?: number
  aces?: number
  blocks?: number
}

export class teamstat {
  action?: string
  value?: string
}

export class highstat{
  statcount?: number
  stattype?: string
  playerid?: string
}

export class leader{
  fname?: string
  lname?: string
  action?: string
  count?: number
}

export class gamescore {
  hometeam?: string
  opponent?: string
  game?: number
  hscore?: number
  oscore?: number
}

export class userToken {
  username: string;
  ttl: Date;
}

export class pbpPosition {
  posNo: number;
  playerName: string;
  objectId: string;
}

export class CourtPosition {
  posNo: number;
  player?: PlayerWithId;
  playerPos: string;
}

export class Player {
  jersey?: string;
  FirstName?: string;
  LastName?: string;
  islibero?: boolean = false;
  playerid?: string;
  fullName?: string;


  constructor(jersey?: string, fname?: string, lastname?: string, libero?: boolean,
    playerId?: string) {
    this.jersey = jersey;
    this.FirstName = fname;
    this.LastName = lastname;
    this.playerid = playerId;
  }
}

export class PlayerWithId extends Player {
  objectId?: string;
}



export class StatNib {
  pos?: number;
  stattype?: string;
  constructor(pos: number, stattype: string,) {
    this.pos = pos;
    this.stattype = stattype;
  }
}

export class PointPlay {
  homeScore?: number;
  opponentScore?: number;
  action?: string;
  player?: PlayerWithId;
  rotation: CourtPosition[]
}

export interface StatType {
  StatName: string;
  createdAt: string;
  updatedAt: string;
  StatAbbrev: string;
  objectId: string;
}


export class Stat {
  statid?: number;
  matchid?: string;
  gameId?: string
  gamenumber?: number;
  playerid?: string;
  stattype?: string;
  pos?: number;
  player?: PlayerWithId;
  stattime?: Date;
  positions?: CourtPosition[];
  homeScore?: number;
  opponentScore?: number;
  subs?: number;
  rotation?: pbpPosition[];
  passingGrade?: number
}

export class Match {
  Home?: string;
  HomeTeamId?: string
  HomeTeamLibero?: string
  Opponent?: string;
  MatchDate?: string;
  displaydate?: Date;
  matchdisplay?: string;
  //gameDate?: number;
}

export class MatchWithId extends Match {
  objectId?: string;
}

export class Game {
  GameNumber?: number;
  MatchId?: string;
  HomeScore?: number = 0;
  OpponentScore?: number = 0;
  Subs?: number = 0;
  gamedisplay?: string;
}

export class TeamPlayer{
  playerId?: string
  jersey?: string;
  FirstName?: string;
  LastName?: string;
  islibero?: boolean = false;
  playerid?: string;
  fullName?: string;
}


export class TeamPlayerWithID extends TeamPlayer{
  objectId: string
}


export class Team {
  TeamName?: string;
  ClubId?: string;
  Year?: Number;
}


export class Club {
  ClubName?: string;
}

export class ClubWithId extends Club {  
  objectId: string
}

export class TeamWithId extends Team {
  objectId?: string;
}



export class GameWithId extends Game {
  objectId: string;
}

export class gameMatch extends MatchWithId {
  gameNumber?: number;
  gameId?: string;
}

export class GameScore {
  home = 0;
  opponent = 0;
}

export interface Position {
  playerPos: string;
  posNo: number;
}

export interface ArrayOfStats {
  gamenumber: number;
  homeScore: number;
  opponentScore: number;
  pos: number;
  positions: Position[];
  statid: number;
  stattime: Date;
  stattype: string;
}

export interface rotation {
  pos?: number;
  playerId?: string;
}


export interface statEntry {
  statid?: number,
  homescore?: number,
  matchid?: string,
  gamenumber?: number,
  StatType?: string,
  PlayerId?: string,
  statdate?: number,
  pos?: Map<any,any>,
  id?: string,
  opponentscore?: number,
  rotation?: {1: string, 2: string, 3: string, 4: string, 5: string, 6: string},
  subs?: number
}



export interface statModel {
  matchid: number;
  gamenumber: number;
  stattype: string;
  pos: number;
  playerid: number;
  statdate: Date;
  statid: number;
}

export interface RotationPlayer {
  id: string;
  firstName: string;
  islibero: boolean;
  jersey: string;
  lastName: string;
  playerid: string;
}

export interface RotationObject {
  playerPos: string;
  posNo: number;
  player: Player;
}

export class PlayerNib {
  pos?: number;
  playerid?: string;
  constructor(pos: number, playerid: string,) {
    this.pos = pos;
    this.playerid = playerid;
  }
}

export class stat {
  firstname?: string;
  lastname?: string;
  fullname?: string;
  stattype?: string;
  objectId?: string;
}


export class MatchUser {
  id: number
  first: string
  last: string
}

export interface statView {
  jersey?: string;
  firstName?: string;
  lastName?: string;
  PlayerId?: string;
  k?: number;
  h?: number
  he?: number;
  b?: number;
  bt?: number;
  be?: number;
  a?: number;
  d?: number;
  bhe?: number;
  sre?: number;
  sr?: number;
  se?: number;
  sa?: number;
}

export interface fileInfo {
  name?: string;
  url?: string
}
