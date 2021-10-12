import Dexie from "dexie";
//mport relationships from 'dexie-relationships'

export class OfflineDatabase extends Dexie {
    // Declare implicit table properties.
    // (just to inform Typescript. Instanciated by Dexie in stores() method)
    players: Dexie.Table<IPlayers, string>; 
    matches: Dexie.Table<IMatches, string>;
    games: Dexie.Table<IGames, string>;
    playbyplay: Dexie.Table<IPlayByPlay, string>;
    stats: Dexie.Table<IStats, string>;
    teamplayers: Dexie.Table<ITeamPlayers, string>;
    teams: Dexie.Table<ITeams, string>;
    clubs: Dexie.Table<IClubs, string>;
    db: any

    constructor () {
        super("OfflineDatabase");
        this.db = this;
        
        this.db.version(1).stores({
            players: '++objectId, FirstName, LastName',
            matches: '++objectId, Home, HomeTeamId, Opponent, MatchDate, HomeTeamLibero',
            games: '++objectId, GameNumber, MatchId, HomeScore, OpponentScore, MatchDate, Subs',
            playbyplay: '++id, objectId, Action, PlayerId, HomeScore, OpponentScore, StatType, Rotation, GameId, StatDate',
            stats: '++objectId, Subs, PlayerId, HomeScore, OpponentScore, StatType, Rotation, GameId, StatDate',
            teamplayers: '++objectId, PlayerId, TeamId, Jersey, ClubYear',
            teams: '++objectId, TeamName, Year, ClubId',
            clubs: '++objectId, ClubName'
        });

        //this.players = this.table("players");
        // this.matches = this.table("matches");
        // this.games = this.table("games");
        // this.playbyplay = this.table("playbyplay");
        // this.stats = this.table("stats");
        // this.teamplayers = this.table("teamplayers");
        // this.teams = this.table("teams");
        //this.clubs = this.table('clubs');
    }
}

export interface ITeams {
    objectId?: string;
    TeamName?: string;
    Year?: Number;
    ClubId?: string;
}

export interface ITeamPlayers {
    objectId?: string;
    PlayerId?: string;
    TeamId?: string;
    Jersey?: string;
    clubyear?: string;
}

export interface IStats {
    objectId?: string;
    Subs?: number;
    PlayerId?: string;
    HomeScore?: number;
    OpponentScore?: number;
    StatType?: string;
    Rotation?: string;
    GameId?: string;
    MatchId?;
    StatDate?: Date
    CreatedAt?: Date
}

export interface IPlayByPlay {
    id?: number;
    objectId?: string;
    action?: string;
    playerid?: string;
    HomeScore?: number;
    OpponentScore?: number;
    stattype?: string;
    Rotation?: string;
    gameid?: string;
    StatDate: Date;
}

export interface IGames {
    objectId?: string;
    GameNumber?: number;
    MatchId?: string;
    HomeScore?: number;
    OpponentScore?: number;
    Subs?: number;
}

export interface IClubs {
    objectId?: string;
    ClubName?: string;
}

export interface IPlayers {
    objectId?: string;
    FirstName?: string;
    LastName?: string;
}

export interface IMatches {
    objectId?: string;
    Home?: string;
    HomeTeamId?: string
    HomeTeamLibero?:string
    Opponent?: string;
    MatchDate?: string;
}


