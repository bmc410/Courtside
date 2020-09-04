import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
import { ConnectionService } from 'ng-connection-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { ToastController } from '@ionic/angular';
import { Player, PlayerWithId } from 'src/app/models/appModels';

@Component({
  selector: 'app-playerlist',
  templateUrl: './playerlist.page.html',
  styleUrls: ['./playerlist.page.scss'],
})
export class PlayerlistPage implements OnInit {

  selectedPlayer: Player;
  selectedPlayers: PlayerWithId[];
  availablePlayers:  PlayerWithId[] = [];
  players:  PlayerWithId[] = [];
  menuitems = [{
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
}];

  
  constructor(private router: Router,
    private matchService: MatchService,
    private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController) { 
      this.matchService.loadPlayers()
    }

  ngOnInit() {
    this.matchService.getPlayersAsync().subscribe(data => {
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
    });
  }

  logoff() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}

  showPlayer(item) {
    this.router.navigate(['/app/tabs/playerlist/playerdetail'], { queryParams: { context: JSON.stringify(item) } });
  }

  addPlayer() {
    this.router.navigate(['/app/tabs/playerlist/playerdetail'], { queryParams: { context: '-1' } });
  }

  removeItem(item) {
    this.deleteplayer(item.objectId)
  }

  async deleteplayer(id) {
    this.matchService.deletePlayer(id).then(x => {
      this.matchService.loadPlayers()
    })

    const toast = await this.toastController.create({
      color: 'danger',
      duration: 2000,
      message: 'Player deleter'
    });

    await toast.present();
    
  }
  
}
