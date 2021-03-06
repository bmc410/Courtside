import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
// import { ConnectionService } from 'ng-connection-service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { ClubWithId, TeamWithId } from 'src/app/models/appModels';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {
  clubs: ClubWithId[] = [];
  teams: TeamWithId[] = [];
  team: TeamWithId;
  displayedColumns = ['TeamName', 'Opponent', 'Year'];
  dataSource = new MatTableDataSource<TeamWithId>(this.teams);
  
  constructor(private router: Router,
    private matchService: MatchService,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController) { 

      this.matchService.loadTeams();
      
    }


  menuitems = [{
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
  }];
  
  logoff() {
      this.authenticationService.logout();
      //window.location.href = '/login';
      this.router.navigate(['/login']);
  }

  async getClubsAndTeams(event) {
    await this.matchService.getClubs().then(async data => {
      var json = JSON.stringify(data);
      this.clubs = JSON.parse(json);
      await this.matchService.getTeamsAsync().subscribe(data => {
        var json = JSON.stringify(data);
        this.teams = JSON.parse(json);
      });
      if(event) {
        setTimeout(() => {
          //console.log('Async operation has ended');
          try {
            event.target.complete();
          } catch (e) {
            //console.error(e);
          }
          
        }, 0);
      }
    });

   
  }

  ionViewDidEnter() {
    this.getClubsAndTeams(null)
  }

  async ngOnInit() {
    this.getClubsAndTeams(event)
  }

  doRefresh(event) {
    this.getClubsAndTeams(event)
  }
  

  addTeam() {
    this.router.navigate(['/app/tabs/teams/teamdetail'], { queryParams: { context: '-1' } });
  }

  itemSelected(item) {
    this.router.navigate(['/app/tabs/teams/teamdetail'], { queryParams: { context: JSON.stringify(item) } });
  }

  getClubNameById(id: string) {
    var c = this.clubs.filter(x => x.objectId == id)[0]
    if (c) {
      return c.ClubName
    }
    else {
      return ''
    }
  }

}
