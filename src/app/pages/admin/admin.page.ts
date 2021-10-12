import { Component, OnInit } from '@angular/core';
import * as internal from 'events';
import { BigIntStats } from 'fs';
import { min } from 'rxjs/operators';
import { fileInfo, GameWithId, MatchWithId } from 'src/app/models/appModels';
import { IClubs, IMatches, IPlayers, IStats, ITeamPlayers, ITeams, OfflineDatabase } from 'src/app/models/dexie-models';
import { MatchService } from 'src/app/services/matchservice';
import { OfflineService } from 'src/app/services/offline.service';
import { threadId } from 'worker_threads';
import {
  AngularFireStorage,
  AngularFireStorageReference,
  AngularFireUploadTask
} from '@angular/fire/storage';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
})
export class AdminPage implements OnInit {
  onlineClubs: IClubs[] = [];
  offlineClubs: IClubs[] = [];
  onlineTeams: ITeams[] = [];
  offlineTeams: ITeams[] = [];
  onlinePlayers: IPlayers[] = [];
  offlinePlayers: IPlayers[] = [];
  onlineTeamPlayers: ITeamPlayers[] = [];
  offlineTeamPlayers: ITeamPlayers[] = [];
  offlineMatches: IMatches[]
  onlineMatches: IMatches[]

  onlineClubCount: string = "0";
  offlineClubCount: string = "0";
  onlineTeamCount: string = "0";
  offlineTeamCount: string = "0";
  onlinePlayerCount: string = "0";
  offlinePlayerCount: string = "0";
  onlineTeamPlayerCount: string = "0";
  offlineTeamPlayerCount: string = "0";
  offlineGameCount: string = "0";
  offlineMatchCount: string = "0";
  

  selectedmatch: string = ""
  uploadedMatchId: string = ""
  selectedMatchObj: MatchWithId = {}
  selectedGames: GameWithId[] = []
  tsGoogleDrive: any
  fileInfos: fileInfo[] = []

  constructor(private matchservice: MatchService,
    private messageService: MessageService,
    private offlineDB: OfflineService,
    private http: HttpClient,
    private storage: AngularFireStorage,
    private dexie: OfflineDatabase) {
    //this.tsGoogleDrive = new TsGoogleDrive({ keyFilename: "serviceAccount.json" });
  }

  ngOnInit() {
    this.getPlayers()
    //this.offlineDB.loadPBP()
    this.GetClubs()
    this.getTeams()
    //this.GetPlayerData()
    this.GetTeamPlayers()
    //this.GetGameData()
    this.GetMatchData()
  }

  makebackupfilename(file:string) {
    let instance = new Date
    var noExt = file.replace('.json', '')
    var dt = instance.toJSON().substring(0,19)
    dt = dt.replace(/-/g,'_')
    dt = dt.replace(/:/g,'_')
    dt = dt.replace('T','_')
    return noExt + dt + '.json'
  }

  // ******** Firebase Storage ********

  //GETS
  GetGames() {
    this.offlineDB.loadGames()
    this.offlineDB.getGames().subscribe(games => {
      this.offlineGameCount = games.length
    })
  }

  getTeams() {
    //Online
    let path = environment.teamPath + environment.teamFile;
    var storageRef = this.storage.ref(path);
    storageRef.getDownloadURL().subscribe(url => {
      this.http.get<any>(url)
        .subscribe(teams => {
          this.onlineTeams = teams
          this.onlineTeamCount = this.onlineTeams.length.toString()
        },
          error => {
            console.log(error);
          }
        );
    })

    //Offline
    this.offlineDB.loadTeams();
    this.offlineDB.getTeams().subscribe(clubs => {
      this.offlineTeams = clubs;
      this.offlineTeamCount = this.offlineTeams.length.toString()
    })
  }

  GetClubs() {
    //Offline
    let path = environment.clubPath + environment.clubFile;
    var storageRef = this.storage.ref(path);
    storageRef.getDownloadURL().subscribe(url => {
      this.http.get<any>(url)
        .subscribe(clubs => {
          this.onlineClubs = clubs
          this.onlineClubCount = clubs.length.toString()
        })
    })
    //Online
    this.offlineDB.loadClubs();
    this.offlineDB.getClubs().subscribe(clubs => {
      this.offlineClubs = clubs;
      this.offlineClubCount = this.offlineClubs.length.toString()
    })
  }

  getPlayers() {
    //Offline
    let path = environment.playerPath + environment.playerFile;
    var storageRef = this.storage.ref(path);
    storageRef.getDownloadURL().subscribe(url => {
      this.http.get<any>(url)
        .subscribe(players => {
          players.forEach(player => {
            let p: IPlayers = {
              objectId: player.objectId,
              FirstName: player.FirstName,
              LastName: player.LastName
            }
            this.onlinePlayers.push(p)
            this.onlinePlayerCount = players.length.toString()
          });
          //console.log(this.onlinePlayers)
        },
          error => {
            console.log(error);
          }
        );
    })

    //Online
    this.offlineDB.loadPlayers();
    return this.offlineDB.getPlayers().subscribe(players => {
      this.offlinePlayers = players;
      this.offlinePlayerCount = this.offlinePlayers.length.toString()
    })
  }

  GetTeamPlayers() {
    //Online
    let path = environment.teamPlayersPath + environment.teamPlayersFile;
    var storageRef = this.storage.ref(path);
    storageRef.getDownloadURL().subscribe(url => {
      this.http.get<any>(url)
        .subscribe(teamplayers => {
          this.onlineTeamPlayers = teamplayers
          this.onlineTeamPlayerCount = teamplayers.length.toString()
        },
          error => {
            console.log(error);
          }
        );
    })

    //Offline
    this.offlineDB.loadTeamPlayers();
    this.offlineDB.getTeamPlayers().subscribe(tps => {
      this.offlineTeamPlayers = tps;
      this.offlineTeamPlayerCount = this.offlineTeamPlayers.length.toString()
    })
  }

  GetMatchData() {
 let path = environment.matchPath + environment.matchFile;
    var storageRef = this.storage.ref(path);
    storageRef.getDownloadURL().subscribe(url => {
      this.http.get<any>(url)
        .subscribe(matches => {
          this.onlineMatches = matches 
        },
          error => {
            console.log(error);
          }
        );
    })

    this.offlineDB.getMatchesForSync().then(matches => {
      this.offlineMatches = matches
      this.offlineMatchCount = this.offlineMatches.length.toString()
      //console.log(this.offlineMatches)
    })
  }

  //SAVES
  SyncPlayers(e: any) {
    if (e.target.id == "syncplayerstocloud") {
      this.offlineDB.loadPlayers();
      this.offlineDB.getPlayersNow().then(x => {
        //console.log(x)
        //this.offlinePlayerCount = this.offlinePlayers.length.toString()
        let file = environment.playerFile
        let path = environment.playerPath
        this.upload(JSON.stringify(x), file, path)
        var msg = file + " uploaded!"
        this.messageService.add({
          severity: 'success',
          summary: 'Success', detail: msg
        });
      })
    }
    else {
      this.offlineDB.clearPlayersTable();
      let path = environment.playerPath + environment.playerFile;
      var storageRef = this.storage.ref(path);
      storageRef.getDownloadURL().subscribe(url => {
        this.http.get<any>(url)
          .subscribe(players => {
            players.forEach(player => {
              let p:IPlayers = {
                objectId: player.objectId,
                FirstName: player.FirstName,
                LastName: player.LastName
              }
              this.offlineDB.addPlayer(p)
              //console.log(this.offlinePlayers)
            });
            
          },
            error => {
              console.log(error);
            }
          );
      })
    }
  }

  SyncTeamPlayers(e) {
    if (e.target.id == "syncteamplayerstocloud") {
      this.offlineDB.loadTeamPlayers();
      this.offlineDB.getTeamPlayersByTeamId(environment.teamId).then(x => {
        if (x && x.length > 0) {
          let file = environment.teamPlayersFile
          let path = environment.teamPlayersPath
          this.upload(JSON.stringify(x), file, path)
          var msg = file + " uploaded!"
          this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
          console.log(x)
        }
        //this.offlinePlayerCount = this.offlinePlayers.length.toString()
      })
      //this.upload(JSON.stringify(this.offlinePlayers), "RLV_TeamPlayers.json")
    }
    else {
      this.matchservice.getAllTeamPlayers().then(tps => {
        var json = JSON.stringify(tps);
        var tpsData = JSON.parse(json);
        this.offlineDB.clearTeamPlayersTable()
        tpsData.forEach(tp => {
          this.offlineDB.addTeamPlayer(tp);
        });
      })
    }

  }

  SyncTeams(e) {
    this.offlineDB.loadTeams();
    this.offlineDB.getTeams().subscribe(x => {
      if (x && x.length > 0) {
        let file = environment.teamFile
        let path = environment.teamPath
        this.upload(JSON.stringify(x), file, path)
        var msg = file + " uploaded!"
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
        console.log(x)
      }
      //this.offlinePlayerCount = this.offlinePlayers.length.toString()
    })
  }

  SyncClubs(e) {
    this.offlineDB.loadClubs()
    this.offlineDB.getClubs().subscribe(x => {
      if (x && x.length > 0) {
        let file = environment.clubFile
        let path = environment.clubPath
        this.upload(JSON.stringify(x), file, path)
        var msg = file + " uploaded!"
        this.messageService.add({ severity: 'success', summary: 'Success', detail: msg });
        console.log(x)
      }
      //this.offlinePlayerCount = this.offlinePlayers.length.toString()
    })
  }

  SyncGames(e) {
    // if (e.target.id == "syncgamestocloud") {
    //   this.offlineDB.loadGames()
    //   this.offlineDB.getGames().then(x => {
    //     //console.log(x)
    //     //this.offlinePlayerCount = this.offlinePlayers.length.toString()
    //     let file = environment.playerFile
    //     let path = environment.playerPath
    //     this.upload(JSON.stringify(x), file, path)
    //     var msg = file + " uploaded!"
    //     this.messageService.add({
    //       severity: 'success',
    //       summary: 'Success', detail: msg
    //     });
    //   })
    // }
    // else {
    //   this.offlineDB.clearPlayersTable();
    //   let path = environment.playerPath + environment.playerFile;
    //   var storageRef = this.storage.ref(path);
    //   storageRef.getDownloadURL().subscribe(url => {
    //     this.http.get<any>(url)
    //       .subscribe(players => {
    //         players.forEach(player => {
    //           let p:IPlayers = {
    //             objectId: player.objectId,
    //             FirstName: player.FirstName,
    //             LastName: player.LastName
    //           }
    //           this.offlineDB.addPlayer(p)
    //           //console.log(this.offlinePlayers)
    //         });
            
    //       },
    //         error => {
    //           console.log(error);
    //         }
    //       );
    //   })
    // }
  }

  //HTTP UPLOAD 

  upload(data: string, filename: string, path: string): void {
    var blob = new Blob([data], { type: "application/json" })
    const filePath = path + filename;
    const storageRef = this.storage.ref(filePath);
    const uploadTask = this.storage.upload(filePath, blob);
  }

  backup(filename: string, path: string) {
    var backupfilename = this.makebackupfilename(filename)
    var storageRef = this.storage.ref(path + filename);
    storageRef.getDownloadURL().subscribe(url => {
      this.http.get<any>(url).subscribe(results => {
        this.upload(JSON.stringify(results), backupfilename, path)
      })
    })
  }

  // ************************************

  
  async UploadMatch(e) {
    //nothing selected
    if (this.selectedmatch == "") {
      this.backup(environment.matchFile, environment.matchPath)
      this.backup(environment.gameFile, environment.gamePath)
      this.backup(environment.pbpFile, environment.pbpPath)
      this.backup(environment.statFile, environment.statPath)
      return
    }


    //sorry can't upload, found a duplicate
    if(this.onlineMatches.filter(x => x.objectId == this.selectedmatch).length > 0) {
      this.messageService.add({severity:'error', summary: 'Sync Failed', detail:'This match already exists.'});
      return 
    }

    let match = this.offlineMatches.filter(x => x.objectId == this.selectedmatch)[0]
    console.log(match)
    //Now create the games, stats and play-by-play
    var games = this.offlineDB.getGamesForSync(match.objectId).then(games => {
      games.forEach(async game => {
        //console.log(game)
    //     var gid = new GameWithId;
    //     gid.GameNumber = g.GameNumber;
    //     gid.HomeScore = g.HomeScore
    //     gid.OpponentScore = g.OpponentScore
    //     gid.MatchId = this.selectedMatchObj.objectId
    //     gid.Subs = 0
    //     var newGame = await this.matchservice.createGame(gid)
    //     var json = JSON.stringify(newGame);
    //     var createdGame = JSON.parse(json)
    //     gid.objectId = createdGame.objectId
    //     //PLAY BY PLAY
        this.offlineDB.getPlayByPlayById(game.objectId).then(pbp => {
          if(pbp.length > 0) {
            console.log(game)
            console.log(pbp)
          }   
    //       var playbyplay: any[] = pbp; //JSON.parse(json);
    //       playbyplay.sort(function (a, b) {
    //         return b - a.date;
    //       });
    //       for (let index = 0; index < playbyplay.length; index++) {
    //         const pbp = playbyplay[index];
    //         var pos = JSON.parse(pbp.rotation)
    //         gid.GameNumber = g.GameNumber
    //         gid.HomeScore = pbp.homescore
    //         gid.OpponentScore = pbp.opponentscore
    //         var player: IPlayers = null
    //         var players = this.offlinePlayers.filter(x => x.objectId == pbp.playerid)
    //         if (players.length > 0) {
    //           player = players[0]
    //         }
    //         //this.matchservice.addPlayByPlay(gid, pos, pbp, player, "")
    //       }
          })
      })
    })
    //STATS
    this.offlineDB.getStatsforMatch(match.objectId).then(stats => {
      console.log(stats)
      //       for (let index = 0; index < stats.length; index++) {
      //         const stat: IStats = stats[index];
      //         stat.PlayerId = stat.PlayerId;
      //         stat.GameId = gid.objectId;
      //         stat.CreatedAt = stat.StatDate;
      //         stat.HomeScore = stat.HomeScore;
      //         stat.OpponentScore = stat.OpponentScore;
      //         stat.Subs = stat.Subs
      //         stat.Rotation = stat.Rotation
      //         //this.matchservice.createStat(stat, gid)
      //       }
      //     })
      //   });
    })
  }
  
  ClearMatch(e) {
    this.offlineDB.clearGamesTable()
  }



  GetTeamData() {
    this.matchservice.getTeams().then(teams => {
      var json = JSON.stringify(teams);
      var teamData: ITeams[] = JSON.parse(json);
      this.onlineTeamCount = teamData.length.toString()
    })

    this.offlineDB.loadTeams();
    this.offlineDB.getTeams().subscribe(clubs => {
      this.offlineTeams = clubs;
      this.offlineTeamCount = this.offlineTeams.length.toString()
    })
  }



  GetPlayerData() {
    // this.matchservice.getPlayers().then(players => {
    //   var json = JSON.stringify(players);
    //   var playerData: IPlayers[] = JSON.parse(json);
    //   this.onlinePlayerCount = playerData.length.toString()
    // })

    this.offlineDB.loadPlayers();
    return this.offlineDB.getPlayers().subscribe(players => {
      this.offlinePlayers = players;
      this.offlinePlayerCount = this.offlinePlayers.length.toString()
    })
  }





 

 

  async uploadFile() {
    const folderId = "";
    const filename = "./icon.png";
    const newFile = this.tsGoogleDrive.upload(filename, { parent: folderId });
    const downloadBuffer = await newFile.download();
  }

  saveFile(error: any, tableData: string) {
    var filename = "stats_" + new Date().toJSON().slice(0, 10) + ".json";
    const blob =
      new Blob([
        tableData],
        {
          //type: "text/plain;charset=utf-8" 
          type: "text/json"
        });
    //saveAs(blob, filename);
  }





  Download() {
    //this.saveFile()

    const idbDB = this.dexie.db.backendDB();
    this.exportToJsonString(idbDB, this.saveFile)
  }

  logIt(error: any, tableData: string) {
    console.log(tableData)
  }


  exportToJsonString(idbDatabase, cb) {
    const exportObject = {};
    const objectStoreNamesSet = new Set(idbDatabase.objectStoreNames);
    const size = objectStoreNamesSet.size;
    if (size === 0) {
      cb(null, JSON.stringify(exportObject));
    } else {
      const objectStoreNames = Array.from(objectStoreNamesSet);
      const transaction = idbDatabase.transaction(
        objectStoreNames,
        'readonly'
      );
      transaction.onerror = (event) => cb(event, null);

      objectStoreNames.forEach((storeName: string) => {
        const allObjects = [];
        transaction.objectStore(storeName).openCursor().onsuccess = (event) => {
          const cursor = event.target.result;
          if (cursor) {
            allObjects.push(cursor.value);
            cursor.continue();
          } else {
            exportObject[storeName] = allObjects;
            if (
              objectStoreNames.length ===
              Object.keys(exportObject).length
            ) {
              cb(null, JSON.stringify(exportObject));
            }
          }
        };
      });
    }
  }


}
function ref(storage: any, arg1: string) {
  throw new Error('Function not implemented.');
}

