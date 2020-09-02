import { Component, OnInit, NgZone } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
import { ConnectionService } from 'ng-connection-service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { ClubWithId, TeamWithId, Player, PlayerWithId, TeamPlayerWithID } from 'src/app/models/appModels';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { FormGroup, Validators, FormBuilder, NgForm } from '@angular/forms';

export class yearModel {
  name: string; 
  code: string;
}

@Component({
  selector: 'app-teamdetail',
  templateUrl: './teamdetail.page.html',
  styleUrls: ['./teamdetail.page.scss'],
})
export class TeamdetailPage implements OnInit {
  context:string
  playersvisable = false;
  teamname: string;
  selectedyear: number
  selectedClub: ClubWithId;  
  teamYears: yearModel[] = [];
  selectedclub:ClubWithId;
  clubs: ClubWithId[] = [];
  param:string;
  selectedTeam: TeamWithId;
  selectedPlayer: Player;
  selectedPlayers: PlayerWithId[];
  availablePlayers:  PlayerWithId[] = [];
  players: PlayerWithId[] = [];
  teamPlayers: TeamPlayerWithID[] = [];
  teamPlayer: PlayerWithId;
  teamPlayerIDs: TeamPlayerWithID[] = []
  pickedPlayers: PlayerWithId[] = [];
  tdForm: FormGroup;
  
  constructor(private route: ActivatedRoute,
    private router: Router,
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
        }
        else {
          let obj = JSON.parse(this.context)
          this.selectedTeam = JSON.parse(this.context);
          this.playersvisable = true;
        }
      });
  
    }

     // convenience getter for easy access to form fields
  get f() { return this.tdForm.controls; }

    menuitems = [{
      label: 'Log out',
      icon: 'pi pi-fw pi-power-off',
      command: () => {
        this.logoff();
      }
    }];
    
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

  async ngOnInit() {
    
    this.tdForm = this.formBuilder.group({
      teamname: ['', Validators.required]
    });

    let year = new Date().getFullYear();
    const teamYear = new yearModel();
    teamYear.code = year.toString()
    teamYear.name = year.toString()
    this.teamYears.push(teamYear);
    for (let index = 1; index < 5; index++) {
      year += 1;
      const teamYear = new yearModel();
      teamYear.code = year.toString()
      teamYear.name = year.toString()
      this.teamYears.push(teamYear);
    }


    await this.matchService.getClubs().then(async data => {
      var json = JSON.stringify(data);
      this.clubs = JSON.parse(json);
      this.selectedclub = this.clubs.filter(c => String(c.objectId) === this.selectedTeam?.ClubId)[0]

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
  
        this.players = this.selectedPlayers;
        this.availablePlayers = this.selectedPlayers;
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
          this.getTeamPlayers()
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

  saveTeam(form: NgForm) {
    if (!this.selectedTeam) {
      let t = new TeamWithId()
      t.TeamName = this.f.username.value;
      t.ClubId = this.f.club.value;
      // this.matchService.createTeam(t).subscribe(data => {
      //   // this.matchService.getTeams().subscribe(data => {
      //   //   var json = JSON.stringify(data);
      //   //   this.teams = JSON.parse(json);
      //   // });
      // })
    }
    else {
      // let t = new TeamWithId()
      // t.TeamName = this.f.username.value;
      // t.ClubId = this.f.club.value;
      // t.Year = this.selectedTeamYear
      // t.objectId = this.selectedTeamId
      // this.matchService.upDateTeam(t).subscribe(data => {
      //   this.matchService.getTeams().subscribe(data => {
      //     var json = JSON.stringify(data);
      //     this.teams = JSON.parse(json);
      //   });
      // })
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

}
