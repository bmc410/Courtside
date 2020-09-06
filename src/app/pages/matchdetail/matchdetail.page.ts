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
import { ClubWithId, TeamWithId, TeamPlayerWithID, PlayerWithId, MatchWithId, gameMatch } from 'src/app/models/appModels';
import { GameselectPage } from '../gameselect/gameselect.page';

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
  matchtitle:any
  currentPopover = null;
  popover: HTMLIonPopoverElement;

  constructor(private route: ActivatedRoute,
    private popoverController: PopoverController,
    private router: Router,
    public modalController: ModalController,
    private matchService: MatchService,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private formBuilder: FormBuilder,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController,
    private authenticationService: AuthenticationService) {
    this.matchService.loadTeams()
    this.route.queryParams.subscribe(params => {
      this.context = params['context'];
      if (this.context == undefined || this.context === "") {
        this.router.navigate(['/app/tabs/matches']);
      }
      else if (this.context === "-1") {
        this.matchid = ""
        this.matchdate = new Date().toLocaleDateString()
      }
      else {
        this.context = JSON.parse(this.context)
      }
    });
  }
  
 ngOnInit() {
    this.matchService.getTeamsAsync().subscribe(data => {
      var json = JSON.stringify(data);
      this.teams = JSON.parse(json);
      if (this.teams.length > 0) {
        this.selectedTeamId = this.context.HomeTeamId
      }
      this.opponent = this.context.Opponent
      this.matchdate = this.context.MatchDate
      this.matchid = this.context.objectId
      this.deletevisible = true
      if (this.matchid != "") {
        this.matchtitle = this.teams.filter(x => x.objectId === this.selectedTeamId)[0]?.TeamName +
        " vs " + this.opponent
      }
      else {
        this.matchtitle = "Add Teams"
      }

    });
    //this.matchdate = new Date().toLocaleDateString()
  }

  logoff() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  async deleteMatch() {
    await this.matchService.deleteMatch(this.matchid).then(async x => {
      this.matchService.loadMatches()
      this.router.navigate(['/app/tabs/matches']);
      const toast = await this.toastController.create({
        color: 'danger',
        duration: 2000,
        message: 'Deleted successfully'
      });
  
      await toast.present();
    })
  }

  newDate(e) {
    var d = new Date(e.detail.value)
    this.matchdate = d.toLocaleDateString()
    console.log(e)
  }

  async startMatch(e) {
    const popover = await this.popoverController.create({
      component: GameselectPage,
      //event: e,
      translucent: true
    });
    this.currentPopover = this.popover;
    popover.onDidDismiss().then((dataReturned) => {
      const item = null
      let gm = new gameMatch();
      gm.gameNumber = dataReturned.data;
      gm.Home = this.teams.filter(x => x.objectId === this.selectedTeamId)[0]?.TeamName;
      gm.MatchDate = this.matchdate;
      gm.objectId = this.matchid;
      gm.Opponent = this.opponent;
      gm.HomeTeamId = this.selectedTeamId;
      this.router.navigate(['/app/tabs/matches/matchdetail/match'], { queryParams: { context: JSON.stringify(gm) } });
      //console.log(dataReturned.data)
    });
    popover.style.cssText = '--width: 80vw';
    return popover.present()
    // let gm = new gameMatch();
    // gm.gameNumber = this.game;
    // gm.Home = this.match.Home;
    // gm.MatchDate = this.match.MatchDate;
    // gm.objectId = this.match.objectId;
    // gm.Opponent = this.match.Opponent;
    // gm.HomeTeamId = this.match.HomeTeamId;

    // this._ngZone.run(() => {
    //   this.router.navigate(["match", gm]).then(result => {
    //     this.matchDialogDisplay = false;
    //   });
    // });
  }

  async saveMatch() {
    let match = new MatchWithId()
    match.HomeTeamId = this.selectedTeamId
    match.Home = this.teams.filter(x => x.objectId === this.selectedTeamId)[0].TeamName
    //let formattedDt = formatDate(this.gameDate.value, 'MM/dd/yyyy', 'en_US')
    match.objectId = this.matchid
    match.MatchDate = this.matchdate
    //match.Home = this.match.Home
    // if(match.objectId == 'undefined' || match.objectId == null || match.objectId == "")
    // {
    //   match.objectId = Guid.create().toString()
    // }
    match.Opponent = this.opponent
    // if(this.offline == true) {
    //   await this.offlineservice.createMatch(match).then( result => {
    //     this.offlineservice.getMatches().subscribe(result => {
    //       this.matches = result;
    //     });
    //   })
    // }
    // else {
      this.matchService.saveMatch(match).then(async data => {
        this.matchService.loadMatches()
        var json = JSON.stringify(data);
        var m = JSON.parse(json);
        this.matchid = m.objectId
        this.deletevisible = true
        const toast = await this.toastController.create({
          color: 'success',
          duration: 2000,
          message: 'Saved successfully'
        });
    
        await toast.present();
      });
    //}
    //this.matchDialogDisplay = false;
    //this.click = false
  }

}
