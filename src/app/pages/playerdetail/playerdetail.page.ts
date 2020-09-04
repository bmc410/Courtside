import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, ToastController } from '@ionic/angular';
import { MatchService } from 'src/app/services/matchservice';
import { ConnectionService } from 'ng-connection-service';
import { FormBuilder } from '@angular/forms';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { PlayerWithId } from 'src/app/models/appModels';

@Component({
  selector: 'app-playerdetail',
  templateUrl: './playerdetail.page.html',
  styleUrls: ['./playerdetail.page.scss'],
})
export class PlayerdetailPage implements OnInit {
  context: any;
  selectedPlayer: PlayerWithId;
  firstname:any;
  lastname:any;
  fullname:any;
  deletevisible:any;
  dob:any
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
        this.selectedPlayer = null
        if (this.context == undefined || this.context === "") {
          this.router.navigate(['/app/tabs/playerlist']);
        } 
        else if (this.context === "-1") {
          this.fullname = 'Add Player'
          this.deletevisible = false
        }
        else {
          this.deletevisible = true
          let obj = JSON.parse(this.context)
          this.selectedPlayer = JSON.parse(this.context);
          this.firstname = this.selectedPlayer.FirstName
          this.lastname = this.selectedPlayer.LastName
          this.fullname = this.selectedPlayer.FirstName + ' ' + this.selectedPlayer.LastName
        }
      });
    }

  ngOnInit() {
   
  }

  async deleteplayer() {
    this.matchService.deletePlayer(this.selectedPlayer.objectId).then(x => {
      this.matchService.loadPlayers()
    })

    const toast = await this.toastController.create({
      color: 'danger',
      duration: 2000,
      message: 'Player deleter'
    });

    await toast.present();
    this.router.navigate(['/app/tabs/playerlist/']);
  }

  async savePlayer() {

    let p = new PlayerWithId()
    p.FirstName = this.firstname
    p.LastName = this.lastname
    this.matchService.savePlayer(p).then(x => {
      this.matchService.loadPlayers()
      this.deletevisible = true
    })

    const toast = await this.toastController.create({
      color: 'success',
      duration: 2000,
      message: 'Saved successfully'
    });

    await toast.present();
  }

  logoff() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
}

}
