import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-gameselect',
  templateUrl: './gameselect.page.html',
  styleUrls: ['./gameselect.page.scss'],
})
export class GameselectPage implements OnInit {
  games:number[] = [];
  game:number;
  constructor(private popover:PopoverController) { }

  ngOnInit() {
    for (let index = 1; index < 6; index++) {
      this.games.push(index)
    }
  }

  dismiss() {
    this.popover.dismiss();
  }

  startGame(e) {
    this.popover.dismiss(e.target.outerText);
  }
}
