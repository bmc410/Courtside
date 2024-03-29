import { Component, OnInit, NgZone, ViewChild, AfterViewInit } from '@angular/core';
import { MatchWithId, PlayerWithId, Match, Player } from 'src/app/models/appModels';
import { MatchService } from 'src/app/services/matchservice';
import { Router } from '@angular/router';
// import { ConnectionService } from 'ng-connection-service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-matches',
  templateUrl: './matches.page.html',
  styleUrls: ['./matches.page.scss'],
})
export class MatchesPage implements AfterViewInit {
  match: MatchWithId = {};
  player: PlayerWithId = {};
  matches: MatchWithId[] = [];
  selectedMatch: MatchWithId = {};
  displayedColumns = ['Home', 'Opponent', 'MatchDate'];
  datasource: MatTableDataSource<MatchWithId>;
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  menuitems = [{
    label: 'Admin',
    icon: 'pi pi-fw pi-cog',
    command: () => {
      this.admin();
    }
  },
  {
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
  }];

  admin() {
    this.router.navigate(['/app/tabs/admin']);
  }

  constructor(//private matchService: MatchService,
    private router: Router,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private db: OfflineService,
    private messageService: MessageService) { }

  async ngOnInit() {
    this.db.loadMatches()
    this.db.loadTeams()
    this.db.loadPlayers()
    this.getMatchesAsync(null)
    // this.db.loadPlayers();
    // this.db.getPlayers().subscribe(x => {
    //   console.log(x)
    // })
  }

  ngAfterViewInit() {
    //if (!this.networkService.isConnected) {
      

    // } else {
    //   this.matchService.loadMatches();
    //   this.getMatchesAsync(null)
    // }
    //console.log(this.sort);

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.datasource.filter = filterValue.trim().toLowerCase();
  }

  async getMatchesAsync(event) {
    //if (!this.networkService.isConnected) {
      this.db.getMatches().subscribe(results => {
        this.matches = results
        if (this.matches && this.matches.length > 0) {
          this.datasource = new MatTableDataSource(this.matches);
          this.datasource.sort = this.sort;
        }
        if (event) {
          setTimeout(() => {
            //console.log('Async operation has ended');
            event.target.complete();
          }, 0);
        }
      })
    //}
    // else {
    //   await this.matchService.getMatchesAsync().subscribe(result => {
    //     var json = JSON.stringify(result);
    //     this.matches = JSON.parse(json);
    //     if (this.matches && this.matches.length > 0) {
    //       this.datasource = new MatTableDataSource(this.matches);
    //       this.datasource.sort = this.sort;

    //     }
    //     if (event) {
    //       setTimeout(() => {
    //         //console.log('Async operation has ended');
    //         event.target.complete();
    //       }, 0);
    //     }
    //   });
    // }
  }

  logoff() {
    this.authenticationService.logout();
    //window.location.href = '/login';
    this.router.navigate(['/login']);
  }

  ionViewDidEnter() {
    //if(!this.networkService.isConnected) {
      this.db.loadMatches()
    // }
    // else {
    //   this.matchService.loadMatches();
    // }
    // this.getMatchesAsync(null)

  }

  addMatch() {
    this.router.navigate(['/app/tabs/matches/matchdetail'], { queryParams: { context: '-1' } });
  }

  onRowSelect(item) {
    this.router.navigate(['/app/tabs/matches/matchdetail'], { queryParams: { context: JSON.stringify(item) } });
  }

  doRefresh(event) {
    this.getMatchesAsync(event)
  }

}
