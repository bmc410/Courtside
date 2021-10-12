import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController, PopoverController } from '@ionic/angular';
import { MatchService } from 'src/app/services/matchservice';
// import { ConnectionService } from 'ng-connection-service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService, SelectItem } from 'primeng/api';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { ClubWithId, TeamWithId, TeamPlayerWithID, PlayerWithId, MatchWithId, gameMatch, GameWithId } from 'src/app/models/appModels';
import { GameselectPage } from '../gameselect/gameselect.page';
import { Guid } from 'guid-typescript';
import { IGames } from 'src/app/models/dexie-models';

@Component({
  selector: 'app-matchdetail',
  templateUrl: './matchdetail.page.html',
  styleUrls: ['./matchdetail.page.scss'],
})
export class MatchdetailPage implements OnInit {
  currentModal: any
  context: any
  deletevisible = false;
  playersvisable = false;
  selectedteamname: string;

  selectedyear: Number
  teamYears: Number[] = [];
  selectedclub: string;
  match: MatchWithId = {};
  games: IGames[] = [];
  game: IGames;
  clubs: ClubWithId[] = [];
  param: string;
  selectedteam: string;
  selectedPlayer: TeamPlayerWithID;
  selectedPlayers: PlayerWithId[];
  availablePlayers: PlayerWithId[] = [];
  players: PlayerWithId[] = [];
  teamPlayers: TeamPlayerWithID[] = [];
  teamPlayer: PlayerWithId;
  teamPlayerIDs: TeamPlayerWithID[] = []
  pickedPlayers: PlayerWithId[] = [];
  tdForm: FormGroup;
  displayPlayer = false
  menuitems = [{
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
  }];
  selectedTeamId: string;
  dialogMatchId: string;
  dilogOpponent: string;
  selectedTeamName: string;
  matches: MatchWithId[] = [];
  teams: TeamWithId[] = [];
  team: TeamWithId;
  matchdate: string;
  opponent: string;
  matchid: string;
  matchtitle: any
  currentPopover = null;
  popover: HTMLIonPopoverElement;

  liberoPlayers:any;
  selectedLibero: any;

  constructor(private route: ActivatedRoute,
    private popoverController: PopoverController,
    private router: Router,
    public modalController: ModalController,
    //private matchService: MatchService,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private formBuilder: FormBuilder,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController,
    private authenticationService: AuthenticationService) {

    this.offlineservice.loadTeams()
    this.offlineservice.loadPlayers();
    this.offlineservice.loadTeamPlayers();
    this.offlineservice.loadGames()

    offlineservice.getTeams().subscribe(teams => {
      this.teams = teams
      this.offlineservice.getPlayers().subscribe(results => {
        this.players = results
        this.route.queryParams.subscribe(params => {
          this.context = params['context'];
          if (this.context == undefined || this.context === "") {
            this.router.navigate(['/app/tabs/matches']);
          }
          else if (this.context === "-1") {
            this.matchid = ""
            this.context = {}
            //this.context.Home = 'Home'
            //this.context.Opponent = 'Opponent'
            this.selectedTeamId = ""
            this.matchdate = new Date().toLocaleDateString()
            this.matchtitle = this.context.Home +
              " vs " + this.context.Opponent
          }
          else {
            this.context = JSON.parse(this.context)
            this.match = this.context
            this.setMatchDetails(this.context)
          }
        });
      });
    })
  }

  setMatchDetails(match) {
    this.matchid = match.MatchId
    this.selectedTeamId = match.HomeTeamId
    this.selectedLibero = match.HomeTeamLibero
    this.opponent = match.Opponent
    this.matchtitle = this.teams.filter(x => x.objectId === this.selectedTeamId)[0]?.TeamName +
      " vs " + this.opponent
  }

  ngOnInit() {
    this.opponent = this.context.Opponent
    this.matchdate = this.context.MatchDate
    this.matchid = this.context.objectId
    this.setupGames()

    //}

    //this.matchdate = new Date().toLocaleDateString()
  }

 
  Refresh() {
    this.setupGames()
  }

  setupGames() {
    if (this.match.objectId) {
      this.games = []
      this.offlineservice.getGamesForSync(this.match.objectId).then(games => {
        //this.games = games.sort()
        this .games = games.sort((a, b) => a.GameNumber < b.GameNumber ? -1 : a.GameNumber > b.GameNumber ? 1 : 0)

        // for (let index = 0; index <= 4; index++) {
        //   var gh: IGames = {}
        //   gh.GameNumber = index + 1;
        //   gh.MatchId = this.match.objectId
        //   let g = games.filter(x => x.GameNumber === index + 1)
        //   if (g.length > 0) {
        //     let sg = g[0]
        //     gh.HomeScore = sg.HomeScore;
        //     gh.OpponentScore = sg.OpponentScore;
        //     gh.Subs = sg.Subs;
        //   } else {
        //     gh.HomeScore = 0;
        //     gh.OpponentScore = 0;
        //     gh.Subs = 0;
        //   }
        //   this.games.push(gh)
        // }
      });
    }
    else {
      this.deletevisible = false
      this.matchtitle = "Add Teams"
    }
  }

  logoff() {
    this.authenticationService.logout();
    //window.location.href = '/login';
    this.router.navigate(['/login']);
  }

  async deleteMatch() {
    this.offlineservice.deleteMatch(this.matchid).then(async x => {
      //this.matchService.loadMatches()
      this.router.navigate(['/app/tabs/matches']);
      const toast = await this.toastController.create({
        color: 'danger',
        duration: 1000,
        message: 'Deleted successfully'
      });

      await toast.present();
    })
  }

  // async deleteMatch() {
  //   await this.matchService.deleteMatch(this.matchid).then(async x => {
  //     this.matchService.loadMatches()
  //     this.router.navigate(['/app/tabs/matches']);
  //     const toast = await this.toastController.create({
  //       color: 'danger',
  //       duration: 2000,
  //       message: 'Deleted successfully'
  //     });

  //     await toast.present();
  //   })
  // }

  newDate(e) {
    var d = new Date(e.detail.value)
    this.matchdate = d.toLocaleDateString()
    console.log(e)
  }

  async startMatch(e) {
    // const popover = await this.popoverController.create({
    //   component: GameselectPage,
    //   //event: e,
    //   translucent: true
    // });
    // this.currentPopover = this.popover;
    // popover.onDidDismiss().then((dataReturned) => {
    //   if (dataReturned.data != undefined) {
    const item = null
    let gm = new gameMatch();
    gm.gameNumber = e.GameNumber;
    gm.Home = this.teams.filter(x => x.objectId === this.selectedTeamId)[0]?.TeamName;
    gm.MatchDate = this.matchdate;
    gm.HomeTeamLibero = this.selectedLibero
    gm.objectId = this.match.objectId;
    gm.Opponent = this.opponent;
    gm.HomeTeamId = this.selectedTeamId;
    this.router.navigate(['/app/tabs/matches/matchdetail/match'], { queryParams: { context: JSON.stringify(gm) } });
    //   }
    // });
    // popover.style.cssText = '--width: 80vw';
    // return popover.present()
  }

  async saveMatch() {
    let match = new MatchWithId()
    match.HomeTeamId = this.selectedTeamId
    match.Home = this.teams.filter(x => x.objectId === this.selectedTeamId)[0].TeamName
    //let formattedDt = formatDate(this.gameDate.value, 'MM/dd/yyyy', 'en_US')
    match.objectId = this.match.objectId
    match.MatchDate = this.matchdate
    match.HomeTeamLibero = this.selectedLibero
    //match.Home = this.match.Home
    match.Opponent = this.opponent
    
    if(match.objectId == 'undefined' || match.objectId == null || match.objectId == "")
    {
      objectId: 
      match.objectId = this.offlineservice.createObjectId(),
      await this.createMatch(match)

    } else 
    {
      this.updateMatch(match)
    }    
  }

  createFiveGames(matchId:string) {
    for (let index = 0; index <= 4; index++) {
      var gh: IGames = {}
      gh.GameNumber = index + 1;
      gh.MatchId = this.match.objectId
      gh.HomeScore = 0;
      gh.OpponentScore = 0;
      gh.Subs = 0;
      gh.objectId = this.offlineservice.createObjectId()
      this.offlineservice.createGame(gh).then(() => {
        this.setupGames()
      })
    }
  }
  

  createMatch(match) {
    this.offlineservice.createMatch(match).then(() => {
        this.offlineservice.getMatchesForSync().then(async result => {
        this.match = match
        this.matchid = match.objectId
        this.matches = result;
        this.deletevisible = true
        //this.setupGames()
        this.createFiveGames(match.objectId)
        this.setMatchDetails(match)
        const toast = await this.toastController.create({
          color: 'success',
          duration: 1000,
          message: 'Saved successfully'
        });
        await toast.present();

      });
    })
  }

  async updateMatch(match) {
    await this.offlineservice.updateMatch(match).then(result => {
      this.offlineservice.getMatches().subscribe(async result => {
        this.matchid = match.objectId
        this.matches = result;
        this.deletevisible = true
        const toast = await this.toastController.create({
          color: 'success',
          duration: 1000,
          message: 'Saved successfully'
        });
        await toast.present();

      });
    })
  }

}
