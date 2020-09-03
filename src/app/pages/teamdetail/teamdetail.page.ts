import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
import { ConnectionService } from 'ng-connection-service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { ClubWithId, TeamWithId, Player, PlayerWithId, TeamPlayerWithID } from 'src/app/models/appModels';
import { ToastController, ModalController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';
import { PlayerpopoverPage } from '../playerpopover/playerpopover.page';

@Component({
  selector: 'app-teamdetail',
  templateUrl: './teamdetail.page.html',
  styleUrls: ['./teamdetail.page.scss'],
})
export class TeamdetailPage implements OnInit {
  currentModal:any
  context:string
  deletevisible=false;
  playersvisable = false;
  selectedteamname: string;
  selectedyear: Number
  teamYears: Number[] = [];
  selectedclub:string;
  clubs: ClubWithId[] = [];
  param:string;
  selectedTeam: TeamWithId = new TeamWithId();
  selectedPlayer: TeamPlayerWithID;
  selectedPlayers: PlayerWithId[];
  availablePlayers:  PlayerWithId[] = [];
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
  
  constructor(private route: ActivatedRoute,
    private router: Router,
    public modalController: ModalController,
    private matchService: MatchService,
    private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private formBuilder: FormBuilder,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController,
    private authenticationService: AuthenticationService) { 
     
      this.route.queryParams.subscribe(params => {
        this.context = params['context'];
        if (this.context == undefined || this.context === "") {
          this.router.navigate(['/app/tabs/teams']);
        } 
        else if (this.context === "-1") {
          this.playersvisable = false;
          this.selectedTeam = null;
          this.selectedclub = null;
          this.deletevisible = false
        }
        else {
          let obj = JSON.parse(this.context)
          this.selectedTeam = JSON.parse(this.context);
          this.playersvisable = true;
          this.deletevisible = true
        }
      });
  
  }
  
  removeItem(item) {
      this.matchService.deleteTeamPlayer(item.objectId).then(x => {
        this.matchService.loadTeamPlayers(this.selectedTeam.objectId)
      })
  }

  async addPlayers() {
      const modal = await this.modalController.create({
        component: PlayerpopoverPage,
        swipeToClose: true,
        componentProps: {
          'players': JSON.stringify(this.teamPlayers),
        }
      });
      this.currentModal = modal
      modal.onDidDismiss().then((dataReturned) => {
        this.matchService.addPlayersToTeam(dataReturned.data, this.selectedTeam.objectId).subscribe(x => {
          this.matchService.loadTeams()
          this.matchService.loadTeamPlayers(this.selectedTeam.objectId)
          //this.getTeamPlayers()
        })
        console.log(dataReturned)
      });
      return await modal.present();
  }
    
  logoff() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
  }

  async getTeamPlayers() {
      this.teamPlayers = []
      this.teamPlayerIDs = []
      this.pickedPlayers = []
      this.availablePlayers = []
      this.selectedPlayers.forEach((x) => {
        this.availablePlayers.push(Object.assign({}, x));
      })
       await this.matchService.getPlayersByTeamId(this.selectedTeam.objectId).then(result => {
        var json = JSON.stringify(result);
        var data = JSON.parse(json);
        data.forEach(p => {
          var pl = this.selectedPlayers.filter(x => x.objectId == p.PlayerId)[0];
          this.availablePlayers.forEach( (item, index) => {
            if(item.objectId == pl.objectId) 
            {
              this.availablePlayers.splice(index,1); 
            }
          });
          //this.pickedPlayers.push(this.selectedPlayers.filter(x => x.objectId = p.PlayerId)[0]);
          let tp = new TeamPlayerWithID()
          tp.FirstName = pl.FirstName
          tp.LastName = pl.LastName
          tp.objectId = p.objectId;
          tp.jersey = p.Jersey
          this.teamPlayers.push(tp);
        });
      })
  }

  showPlayer(item) {
    this.displayPlayer = true
    let tp = new TeamPlayerWithID()
    tp.FirstName = item.FirstName
    tp.LastName = item.LastName
    tp.objectId = item.objectId
    tp.jersey = String(item.jersey)
    this.selectedPlayer = tp
    console.log(this.selectedPlayer)
  }

  close() {
    this.matchService.updatePlayerJersey(String(this.selectedPlayer.jersey), 
      this.selectedPlayer.objectId).subscribe(x => {
        this.matchService.loadTeams()
        this.matchService.loadTeamPlayers(this.selectedTeam.objectId)
    })
  }

  async ngOnInit() {
    
    this.tdForm = this.formBuilder.group({
      teamname: ['', Validators.required]
    });

    let year = new Date().getFullYear();
    this.teamYears.push(year);
    for (let index = 1; index < 5; index++) {
      year += 1;
      this.teamYears.push(year);
    }


    await this.matchService.getClubs().then(async data => {
      var json = JSON.stringify(data);
      this.clubs = JSON.parse(json);
      //this.selectedclub = this.clubs.filter(c => String(c.objectId) === this.selectedTeam?.ClubId)[0].objectId

      await this.matchService.getPlayers().then(data => {
        var json = JSON.stringify(data);
        var d = JSON.parse(json);
        this.selectedPlayers = d
  
        this.selectedPlayers = this.selectedPlayers.sort((t1, t2) => {
          const name1 = t1.LastName.toLowerCase();
          const name2 = t2.LastName.toLowerCase();
          if (name1 > name2) { return 1; }
          if (name1 < name2) { return -1; }
          return 0;
        });
  
        this.players = this.selectedPlayers.slice();
        this.availablePlayers = this.selectedPlayers.slice();
        // this.players = data.map(e => {
        //   return {
        //     id: e.payload.doc.id,
        //     ...e.payload.doc.data() as {}
        //   } as PlayerWithId;
        // })
        for (let index = 0; index < this.players.length; index++) {
          const element = this.players[index];
          this.players[index].fullName = this.players[index].FirstName + " " + this.players[index].LastName
        }
        if (this.selectedTeam) {
          this.selectedyear = this.selectedTeam.Year;
          this.selectedclub = this.selectedTeam.ClubId;
          this.selectedteamname = this.selectedTeam.TeamName;
          this.matchService.loadTeamPlayers(this.selectedTeam.objectId)
          this.matchService.getTeamPlayersAsync().subscribe(x => {
            var json = JSON.stringify(x);
            var d = JSON.parse(json);
            this.teamPlayers = []
            if (d) {
            d.forEach(p => {
              var pl = this.selectedPlayers.filter(x => x.objectId == p.PlayerId)[0];
              this.availablePlayers.forEach( (item, index) => {
                if(item.objectId == pl.objectId) 
                {
                  this.availablePlayers.splice(index,1); 
                }
              });
              let tp = new TeamPlayerWithID()
              tp.playerId = pl.objectId
              tp.FirstName = pl.FirstName
              tp.LastName = pl.LastName
              tp.objectId = p.objectId;
              tp.jersey = p.Jersey
              this.teamPlayers.push(tp);
            });
            //console.log(d)
            //this.teamPlayers = d
          }})
        }
      });
    });
  }

  pickYear(e) {
    this.selectedyear = e.detail.value
    //this.tdForm.patchValue({year: e.detail.value});
  }

  pickClub(e) {
    //this.selectedclub = this.clubs.filter(c => c.objectId === e.detail.value)[0]
  }

  deleteTeam() {
    this.matchService.deleteTeam(this.selectedTeam.objectId).then(async m => {
      this.teamPlayers.forEach(element => {
        this.matchService.deleteTeamPlayer(element.objectId).then(x => {
        })        
      });
      this.matchService.loadTeamPlayers(this.selectedTeam.objectId)
      const toast = await this.toastController.create({
        color: 'danger',
        duration: 2000,
        message: this.selectedTeam.TeamName + ' was deleted'
      });
  
      await toast.present();
      this.matchService.loadTeams();
      this.router.navigate(['/app/tabs/teams/']);

    })
  }

  saveTeam(form: NgForm) {
    var id: string
    if (!this.selectedTeam) {
      let t = new TeamWithId()
      t.TeamName = this.selectedteamname
      t.ClubId = this.selectedclub;
      t.Year = this.selectedyear
      this.matchService.createTeam(t).subscribe(async data => {
        var s = JSON.stringify(data)
        var d = JSON.parse(s);
        id = d.objectId
        this.matchService.loadTeams()

        // this.matchService.getTeams().then(data => {
        //   var json = JSON.stringify(data);
        //   var teams = JSON.parse(json);
        //   this.selectedTeam = teams.filter(t => t.objectId === id)[0]
        // });

        this.playersvisable = true
        this.deletevisible = true
        const toast = await this.toastController.create({
          color: 'success',
          duration: 2000,
          message: 'Saved successfully'
        });
    
        await toast.present();
      })
    }
    else {
      let t = new TeamWithId()
      t.TeamName = this.selectedteamname
      t.ClubId = this.selectedclub;
      t.Year = this.selectedyear
      t.objectId = this.selectedTeam.objectId
      this.matchService.upDateTeam(t).subscribe(async data => {
        this.matchService.loadTeams();

        this.playersvisable = true
        this.deletevisible = true
        const toast = await this.toastController.create({
          color: 'success',
          duration: 2000,
          message: 'Saved successfully'
        });
    
        await toast.present();
      })
    } 
   
  }

  async save() {

    

    const toast = await this.toastController.create({
      color: 'success',
      duration: 2000,
      message: 'Saved successfully'
    });

    await toast.present();
    //this.messageService.add({severity:'success', summary: 'Success Message', detail:'Order submitted'});  }
  }
  
  compareFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = this.compareFn;


  onEditComplete(event) {

  }

  onTeamPlayerSelect(event) {

  }

  dismissModal() {
    if (this.currentModal) {
      this.currentModal.dismiss().then(() => { this.currentModal = null; });
    }
  }

}
