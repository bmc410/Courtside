import { Component, OnInit, NgZone } from '@angular/core';
import { PopoverController, ToastController, NavParams } from '@ionic/angular';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
// import { ConnectionService } from 'ng-connection-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { Player, PlayerWithId } from 'src/app/models/appModels';

@Component({
  selector: 'app-playerpicker',
  templateUrl: './playerpicker.page.html',
  styleUrls: ['./playerpicker.page.scss'],
})
export class PlayerpickerPage implements OnInit {
  selectedPlayer: Player;
  selectedPlayers: PlayerWithId[];
  availablePlayers: PlayerWithId[] = [];
  players: PlayerWithId[] = [];
  menuitems = [{
    label: 'Log out',
    icon: 'pi pi-fw pi-power-off',
    command: () => {
      this.logoff();
    }
  }];
  constructor(private popover: PopoverController,
    private router: Router,
    private matchService: MatchService,
    private navParams: NavParams,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController) {
    //this.matchService.loadPlayers()
    //console.log(this.navParams.data.context);
  }


  ngOnInit() {
    //console.log(this.navParams.data.context);
    // this.matchService.getPlayersAsync().subscribe(data => {
    // var json = JSON.stringify(data);
    // var d = JSON.parse(json);
    this.selectedPlayers = this.navParams.data.context
    // if(this.selectedPlayers == null) {
    //   this.matchService.getPlayersAsync().subscribe(data => { 
    //     console.log(data)
    //   });
    // }


    this.players = this.selectedPlayers.slice()
    this.availablePlayers = this.selectedPlayers;
    for (let index = 0; index < this.players.length; index++) {
      const element = this.players[index];
      this.players[index].fullName = this.players[index].FirstName + " " + this.players[index].LastName
    }




    this.selectedPlayers = this.selectedPlayers.sort((t1, t2) => {
      const name1 = t1.LastName.toLowerCase();
      const name2 = t2.LastName.toLowerCase();
      if (name1 > name2) { return 1; }
      if (name1 < name2) { return -1; }
      return 0;
    });

    // this.players = data.map(e => {
    //   return {
    //     id: e.payload.doc.id,
    //     ...e.payload.doc.data() as {}
    //   } as PlayerWithId;
    // })
  }

  logoff() {
    this.authenticationService.logout();
    //window.location.href = '/login';
    this.router.navigate(['/login']);
  }

  dismiss(item) {
    //console.log(item)
    this.popover.dismiss(item);
  }

  close() {
    this.popover.dismiss()
  }

}
