import { Component, OnInit, NgZone } from '@angular/core';
import { PopoverController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MatchService } from 'src/app/services/matchservice';
// import { ConnectionService } from 'ng-connection-service';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { NetworkService } from 'src/app/services/network.service';
import { OfflineService } from 'src/app/services/offline.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-scoreboard',
  templateUrl: './scoreboard.page.html',
  styleUrls: ['./scoreboard.page.scss'],
})
export class ScoreboardPage implements OnInit {
  deletevisible = false;
  opponent:any
  homescore = 23
  hometeam = "Bill's Team"
  opponentscore = 21
  opponentteam = "Ballyhoo"

  subs = 2



  constructor(private popover:PopoverController,
    private router: Router,
    private matchService: MatchService,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController) { }

  ngOnInit() {
  }

  logoff() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  dismiss(item) {
    console.log(item)
    this.popover.dismiss(item);
  }

  close() {
    this.popover.dismiss()
  }

}
