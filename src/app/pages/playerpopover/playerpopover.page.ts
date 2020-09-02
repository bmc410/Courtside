import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { PlayerWithId } from 'src/app/models/appModels';
import { MatchService } from 'src/app/services/matchservice';

@Component({
  selector: 'app-playerpopover',
  templateUrl: './playerpopover.page.html',
  styleUrls: ['./playerpopover.page.scss'],
})
export class PlayerpopoverPage implements OnInit {

  players: PlayerWithId[] = [];
  selectedPlayers: PlayerWithId[];
  
  constructor(public navParams: NavParams, 
    private matchService: MatchService,
    public modalController: ModalController,
    private popover:PopoverController) { 
    //var players = JSON.parse(this.navParams.get('players'));

    // players.forEach(element => {
    //   this.players.push(element)
    // });

  }


  async ngOnInit() {
    await this.matchService.getPlayers().then(data => {
      var json = JSON.stringify(data);
      var d = JSON.parse(json);
      this.players = d
    })
  }

  dismiss(item)
   {
     this.popover.dismiss(item);
   }

   dismissModal() {
    this.modalController.dismiss(this.selectedPlayers)
   }

}
