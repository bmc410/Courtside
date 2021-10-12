import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CourtPosition, StatNib } from 'src/app/models/appModels';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {

  @Input() libero: string;
  @Input() playerId: string;
  @Input() posNum: string;
  @Input() playerPosition: any;
  //@Input() name: string;
  //@Input() jersey: string;
  @Output() statPost = new EventEmitter();
  @Output() subPost = new EventEmitter();

  constructor() { }

  ngOnInit() {
    //console.log(this.playerPosition)
    //console.log(this.libero)
    if(this.playerPosition[this.posNum].objectId == this.libero)
    {
      "This is the libero for the match"
    }
  }

  isLibero() {
    var l = false
    if (this.playerPosition[this.posNum].player.objectId == this.libero ) {
      l = true
    }
    return l
  }

  isFrontRow() {
    var fr = false
    if (this.posNum == "4" || this.posNum == "3" || this.posNum == "2" ) {
      fr = true
    }
    return fr
  }

  DoStat(stat:string) {
    let s = new StatNib(parseInt(this.posNum),stat);
    this.statPost.emit(s);
  }

  SubPlayer(e: any) {
    this.subPost.emit(this.posNum);
  }

  

}
