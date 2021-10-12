import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavParams, ModalController } from '@ionic/angular';
import { PlayerWithId } from 'src/app/models/appModels';
import { MatchService } from 'src/app/services/matchservice';
import { OfflineService } from 'src/app/services/offline.service';

@Component({
  selector: 'app-playerpopover',
  templateUrl: './playerpopover.page.html',
  styleUrls: ['./playerpopover.page.scss'],
})
export class PlayerpopoverPage implements OnInit {

  players: PlayerWithId[] = [];
  selectedPlayers: PlayerWithId[];
  
  constructor(public navParams: NavParams, 
    //private matchService: MatchService,
    private offlineService: OfflineService,
    public modalController: ModalController,
    private popover:PopoverController) { 
  }


  ngOnInit() {
    var paramplayers = JSON.parse(this.navParams.get('players'));

    this.offlineService.loadPlayers()
    this.offlineService.getPlayers().subscribe(data => {
      //var json = JSON.stringify(data);
      var d = data; //JSON.parse(json);
      d.forEach(element => {
        element.fullName = element.FirstName + ' ' + element.LastName
      });
      paramplayers.forEach(element => {
        d = d.filter(x => x.objectId != element.playerId)
      });
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
