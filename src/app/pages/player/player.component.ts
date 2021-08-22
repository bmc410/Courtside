import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { StatNib } from 'src/app/models/appModels';

@Component({
  selector: 'player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
})
export class PlayerComponent implements OnInit {

  @Input() posNum: string;
  @Input() name: string;
  @Input() jersey: string;
  @Output() statPost = new EventEmitter();
  @Output() subPost = new EventEmitter();

  constructor() { }

  ngOnInit() {
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
