import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-teamdetail',
  templateUrl: './teamdetail.page.html',
  styleUrls: ['./teamdetail.page.scss'],
})
export class TeamdetailPage implements OnInit {
  constructor() { }

  teamYears: Number[] = [];
  clubs = [
    {
      id: 1,
      name: 'Fusion'
    },
    {
      id: 2,
      name: 'Ballyhoo'
    }
  ]

  ngOnInit() {
    let year = new Date().getFullYear();
    this.teamYears.push(year);
    for (let index = 1; index < 5; index++) {
      year += 1;
      this.teamYears.push(year);
    }
  }

  compareFn = (o1, o2) => {
    return o1 && o2 ? o1.id === o2.id : o1 === o2;
  };

  compareWith = this.compareFn;

}
