import { Component, OnInit, NgZone } from '@angular/core';
import { PopoverController, ToastController, NavParams } from '@ionic/angular';
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
  opponent: any
  homescore = 0
  hometeam = ""
  opponentscore = 0
  opponentteam = ""
  matchcontext: any;
  subs = 0



  constructor(private popover: PopoverController,
    private router: Router,
    public navParams: NavParams,
    private matchService: MatchService,
    // private connectionService: ConnectionService,
    private _ngZone: NgZone,
    private authenticationService: AuthenticationService,
    private networkService: NetworkService,
    private offlineservice: OfflineService,
    private messageService: MessageService,
    public toastController: ToastController) { }

  ngOnInit() {
    this.matchcontext = this.navParams.data.context;
    this.homescore = this.matchcontext.game.HomeScore
    this.opponentscore = this.matchcontext.game.OpponentScore
    this.subs = this.matchcontext.game.subs
    this.hometeam = this.matchcontext.match.Home
    this.opponentteam = this.matchcontext.match.Opponent
  }

  update(e) {
    switch (e.target.id) {
      case 'hr':
        this.matchcontext.game.HomeScore -= 1;
        break;
      case 'ha':
        this.matchcontext.game.HomeScore += 1;
        break;
      case 'or':
        this.matchcontext.game.OpponentScore -= 1;
        break;
      case 'oa':
        this.matchcontext.game.OpponentScore += 1;
        break;
        case 'sr':
        this.matchcontext.game.subs -= 1;
        break;
      case 'sa':
        this.matchcontext.game.subs += 1;
        break;

      default:
        break;
    }
  }


  logoff() {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

  dismiss(item) {
    this.popover.dismiss(item);
  }

  close() {
    this.popover.dismiss(this.matchcontext)
  }

}
