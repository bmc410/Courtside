import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
import { ConnectionService } from 'ng-connection-service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { ClubWithId, TeamWithId } from 'src/app/models/appModels';
import { ToastController } from '@ionic/angular';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-teams',
  templateUrl: './teams.page.html',
  styleUrls: ['./teams.page.scss'],
})
export class TeamsPage implements OnInit {
  clubs: ClubWithId[] = [];
  teams: TeamWithId[] = [];
  team: TeamWithId;
  
  constructor(private router: Router,
    private matchService: MatchService,
    private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController) { }


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

  async ngOnInit() {
    await this.matchService.getClubs().then(data => {
      var json = JSON.stringify(data);
      this.clubs = JSON.parse(json);
    });

    await this.matchService.getTeams().then(data => {
      var json = JSON.stringify(data);
      this.teams = JSON.parse(json);
    });

  }

  

  addTeam() {
    this.router.navigate(['/app/tabs/teams/teamdetail'], { queryParams: { context: '-1' } });
  }

  itemSelected(item) {
    this.router.navigate(['/app/tabs/teams/teamdetail'], { queryParams: { context: JSON.stringify(item.data) } });
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
