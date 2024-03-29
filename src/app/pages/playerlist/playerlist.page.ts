import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
// import { ConnectionService } from 'ng-connection-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { ToastController } from '@ionic/angular';
import { Player, PlayerWithId } from 'src/app/models/appModels';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-playerlist',
  templateUrl: './playerlist.page.html',
  styleUrls: ['./playerlist.page.scss'],
})
export class PlayerlistPage implements OnInit {
  datasource: MatTableDataSource<PlayerWithId>;
  displayedColumns = ['FirstName', 'LastName'];
  selectedPlayer: Player;
  selectedPlayers: PlayerWithId[];
  availablePlayers: PlayerWithId[] = [];
  players: PlayerWithId[] = [];
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


  constructor(private router: Router,
    //private matchService: MatchService,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController) {
    //this.matchService.loadPlayers()
  }

  ngOnInit() {
    this.checkAndGetPlayers()
  }

  ionViewDidEnter() {
    this.checkAndGetPlayers()
  }

  //Online / Offline Check
  checkAndGetPlayers() {
    //console.log("checkAndGetPlayers")
    //if (!this.networkService.isConnected) {
      this.offlineservice.loadPlayers()
      this.getOfflinePlayers(null)
    //} 
    // else {
    //   this.matchService.loadPlayers()
    //   this.getPlayers(null)
    // }
  }


  getOfflinePlayers(event) {
    this.offlineservice.getPlayers().subscribe(data => {
      //console.log(data)
      this.selectedPlayers = data
      this.sortAndBind(event)
    })
  }

  sortAndBind(event) {
    this.selectedPlayers = this.selectedPlayers.sort((t1, t2) => {
      const name1 = t1.LastName.toLowerCase();
      const name2 = t2.LastName.toLowerCase();
      if (name1 > name2) { return 1; }
      if (name1 < name2) { return -1; }
      return 0;
    });

    this.players = this.selectedPlayers.slice()
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

    var sortedArray = this.players.sort(function (a, b) {
      return a.LastName > b.LastName ? 1 : a.LastName < b.LastName ? -1 : 0
    })

    this.players = sortedArray.slice()
    if (this.players.length > 0) {
      this.datasource = new MatTableDataSource(this.players);
    }
     else {
       this.datasource = null
     }

    if (event) {
      setTimeout(() => {
        //console.log('Async operation has ended');
        event.target.complete();
      }, 0);
    }
  }

  // getPlayers(event) {
  //   this.matchService.getPlayersAsync().subscribe(data => {
  //     var json = JSON.stringify(data);
  //     var d = JSON.parse(json);
  //     this.selectedPlayers = d
  //     console.log(d)
  //     this.sortAndBind(event)
  //   });
  // }

  logoff() {
    this.authenticationService.logout();
    //window.location.href = '/login';
    this.router.navigate(['/login']);
  }

  showPlayer(item) {
    this.router.navigate(['/app/tabs/playerlist/playerdetail'], { queryParams: { context: JSON.stringify(item) } });
  }

  addPlayer() {
    this.router.navigate(['/app/tabs/playerlist/playerdetail'], { queryParams: { context: '-1' } });
  }

  removeItem(item) {
    //this.deleteplayer(item.objectId)
  }

  // async deleteplayer(id) {
  //   this.matchService.deletePlayer(id).then(x => {
  //     this.matchService.loadPlayers()
  //   })

  //   const toast = await this.toastController.create({
  //     color: 'danger',
  //     duration: 2000,
  //     message: 'Player deleted'
  //   });

  //   await toast.present();

  // }

  doRefresh(event) {
    //this.getPlayers(event)
  }

}
