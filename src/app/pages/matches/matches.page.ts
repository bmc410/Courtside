import { Component, OnInit, NgZone } from '@angular/core';
import { MatchWithId, PlayerWithId, Match } from 'src/app/models/appModels';
import { MatchService } from 'src/app/services/matchservice';
import { Router } from '@angular/router';
// import { ConnectionService } from 'ng-connection-service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements OnInit {
  match: MatchWithId = {};
  player: PlayerWithId = {};
  matches: MatchWithId[] = [];
  selectedMatch: MatchWithId = {};
  displayedColumns = ['Home', 'Opponent', 'MatchDate'];
  dataSource = new MatTableDataSource<MatchWithId>(this.matches);
  
  constructor(private matchService: MatchService,
    private router: Router,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService) { }

  async ngOnInit() {
    this.matchService.loadMatches();
    await this.matchService.getMatchesAsync().subscribe(result => {
      var json = JSON.stringify(result);
      this.matches = JSON.parse(json);
    });
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
      this.router.navigate(['/login']);
  }

  addMatch() {
    this.router.navigate(['/app/tabs/matches/matchdetail'], { queryParams: { context: '-1' } });
  }

  onRowSelect(item) {
    this.router.navigate(['/app/tabs/matches/matchdetail'], { queryParams: { context: JSON.stringify(item) } });
  }


}
